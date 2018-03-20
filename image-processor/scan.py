# USAGE
# python scan.py --image images/page.jpg

# import the necessary packages
from __future__ import division
from pyimagesearch.transform import four_point_transform
from pyimagesearch import imutils
from math import sqrt
from PIL import Image, ImageOps, ImageEnhance
import argparse
import cv2
import numpy
import redis

DISTANCE_THRESHOLD = 20
AREA_THRESHOLD = 0.5

DESIRED_COMBINED_CODE_WIDTH = 400


def process(image, redis_client=None):
    # load the image and compute the ratio of the old height
    # to the new height, clone it, and resize it
    basename = image.split('/')[-1]
    image = cv2.imread(image)
    ratio = image.shape[1] / 500.0
    orig = image.copy()
    image = imutils.resize(image, width=500)

    # convert the image to grayscale, blur it, and find edges
    # in the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(gray, 75, 200)

    # save the original image and the edge detected image
    # cv2.imwrite('output-images/1-original.png', orig)
    # cv2.imwrite('output-images/1-edges.png', edged)

    # find the contours in the edged image, keeping only the
    # largest ones, and initialize the screen contour
    _, contours, _ = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)

    def distance(pointA, pointB):
        dX = pointA[0][0] - pointB[0][0]
        dY = pointA[0][1] - pointB[0][1]
        return sqrt(dX ** 2 + dY ** 2)

    lastContourArea = 1
    gamePieceGeometries = []
    duplicatePieceGeometries = []

    # loop over the contours
    for contour in contours:
        area = cv2.contourArea(contour)

        # when there's a dramatic shift in contour surface areas (i.e. 1/2 as small as the last one),
        # then we've probably stopped finding game pieces
        if area / lastContourArea < AREA_THRESHOLD:
            break

        # approximate the contour
        perimeter = cv2.arcLength(contour, True)
        newGeometry = cv2.approxPolyDP(contour, 0.05 * perimeter, True)

        # if our approximated contour does not have four points,
        # then it's probably not a game piece and we can discard it
        if len(newGeometry) != 4:
            break

        lastContourArea = area

        # sometimes OpenCV finds multiple similar & overlapping shape geometries,
        # so lets make sure this geometry doesn't already exist in our list of found game pieces
        for existingGeometry in gamePieceGeometries:
            # assign existing piece geometry to a new variable
            # since we will be removing points once found
            existingPoints = existingGeometry
            similarPoints = 0
            for newPoint in newGeometry:
                for index, existingPoint in enumerate(existingPoints):
                    if distance(newPoint, existingPoint) <= DISTANCE_THRESHOLD:
                        similarPoints += 1
                        # This point is similar to one of the existing ones.
                        # Delete it so we don't try to match it to a new one next time.
                        numpy.delete(existingPoints, index)
                        break
            if similarPoints == 4:
                # all four points in this new geometry are similar to an
                # existing piece geometry, so this piece is not unique.
                duplicatePieceGeometries.append(newGeometry)
                break

        else:
            # if we don't overlap with a similar rectangle that we've found already
            # (ie we didn't `break` above), then add this piece to the list of found geometries
            firstPieceContour = newGeometry
            gamePieceGeometries.append(newGeometry)

    # find and save the contour (outline) of the piece of paper
    cv2.drawContours(image, gamePieceGeometries, -1, (0, 255, 0), 8)
    cv2.imwrite("image-uploads/contour/%s.jpg" % basename, image)

    # these aspect ratios come from directly measuring the monopoly game pieces
    A = 0.306122449  # aspect ratio of fully stripped pieces
    B = 0.394557823  # aspect ratio of single-stripped pieces
    C = 0.472972973  # aspect ratio of in tact pieces
    smallAspectRatioThreshold = (B - A) / 2 + A  # = 0.350340136  #small (fully stripped) piece threshold
    largeAspectRatioThreshold = (C - B) / 2 + B  # = 0.433765398  #large (in tact) piece threshold
    singleStripDelta = (B - A) * 2  # = 0.088435374  #  proportional height of one strip on a single-strip piece
    multiStripDelta = (C - A) / 2  # = 0.083425262  #  proportional height of each strip on a multi-strip piece

    def get_average_brightness(brightness_image):
        r, g, b = 0, 0, 0
        count = 0
        brightness_image = brightness_image.convert('RGB')
        width, height = brightness_image.size
        for s in range(0, width):
            for t in range(0, height):
                pixlr, pixlg, pixlb = brightness_image.getpixel((s, t))
                r += pixlr
                g += pixlg
                b += pixlb
                count += 1
        return ((r / count) + (g / count) + (b / count)) / 3

    for index, geometry in enumerate(gamePieceGeometries):
        # apply the four point transform to obtain a
        # top-down view of the original image
        warped = four_point_transform(orig, geometry.reshape(4, 2) * ratio)

        # STEP 3: Apply perspective transform
        cv2.imwrite("image-uploads/ticket/%s_%s.jpg" % (basename, index), warped)

        # STEP 4: Crop only desired areas
        pilImage = Image.fromarray(warped)
        width, height = pilImage.size

        aspectRatio = height / width
        if smallAspectRatioThreshold < aspectRatio < largeAspectRatioThreshold:
            stripHeight = singleStripDelta * height * 1.3

            topStrip = pilImage.crop((0, 0.1 * stripHeight, width, stripHeight))
            bottomStrip = pilImage.crop((0, height - stripHeight, width, height - 0.1 * stripHeight))

            # topStrip.save("output-images/4-topStrip-%s.png" % index)
            # bottomStrip.save("output-images/4-bottomStrip-%s.png" % index)

            # use the average brightness to determine
            if get_average_brightness(topStrip) > get_average_brightness(bottomStrip):
                # use the bottom section, strip off top
                pilImage = pilImage.crop((0, stripHeight, width, height))
            else:
                # use the top section, strip off bottom
                pilImage = pilImage.crop((0, 0, width, height - stripHeight))

        elif aspectRatio > largeAspectRatioThreshold:
            # if its a large game piece, strip off both top and bottom strips
            pilImage = pilImage.crop((0, height * multiStripDelta, width, height - height * multiStripDelta))

        # pilImage.save("output-images/5-strip-cropped-%s.png" % index)

        # proportional crop positions for getting the online code
        width, height = pilImage.size
        top = int(height * .46)
        right = int(width * .48)
        bottom = int(height * 1)
        left = int(width * .078)

        onlineCodeImage = pilImage.crop((left, top, right, bottom))
        onlineCodeImage.save("image-uploads/online/%s_%s_a.jpg" % index)

        # proportional crop positions for getting the manual game pieces
        top = int(height * 1)
        right = int(width * 1)
        bottom = int(height * 0)
        left = int(width * .57)

        manualCodeImage = pilImage.crop((left, bottom, right, top))
        croppedWidth, croppedHeight = manualCodeImage.size

        # save individual game pieces
        manual_1 = manualCodeImage.crop((0, 0, croppedWidth * 0.25, croppedHeight))
        manual_1.save("image-uploads/piece/%s_%s_a.jpg" % (basename, index))
        manual_2 = manualCodeImage.crop((croppedWidth * 0.25, 0, croppedWidth * 0.5, croppedHeight))
        manual_2.save("image-uploads/piece/%s_%s_b.jpg" % (basename, index))
        manual_3 = manualCodeImage.crop((croppedWidth * 0.5, 0, croppedWidth * 0.75, croppedHeight))
        manual_3.save("image-uploads/piece/%s_%s_c.jpg" % (basename, index))
        manual_4 = manualCodeImage.crop((croppedWidth * 0.75, 0, croppedWidth, croppedHeight))
        manual_4.save("image-uploads/piece/%s_%s_d.jpg" % (basename, index))
        # TODO publish an update for each ticket, so users can see the progress..
        # if redis_client:
        #     redis_client.lpush('ml-queue', "%s_%s_a" % (basename, index))
        #     redis_client.lpush('ml-queue', "%s_%s_b" % (basename, index))
        #     redis_client.lpush('ml-queue', "%s_%s_c" % (basename, index))
        #     redis_client.lpush('ml-queue', "%s_%s_d" % (basename, index))

    return len(gamePieceGeometries)


# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image",
                help="Path to the image to be scanned. If no image is provided, script will start in worker mode, which connects to redis and watches the 'crop-queue'")
args = vars(ap.parse_args())

if args["image"]:
    process(args["image"])
else:
    redis_client = redis.StrictRedis()
    while True:
        uuid = redis_client.brpoplpush('crop-queue', 'crop-processing')
        path = "image-uploads/original/%s" % uuid
        numTickets = process(path, redis_client=redis_client)
        for ticketIndex in range(0, numTickets):
            for pieceIndex in ['a', 'b', 'c', 'd']:
                redis_client.lpush('ml-queue', "%s_%s_%s" % (uuid, ticketIndex, pieceIndex))
        redis_client.publish('crop-updates', "%s:%d" % (uuid, numTickets))
        redis_client.lrem('crop-processing', 0, uuid)
