# Monopoly Ticket Reader
This web app accepts an image upload, finds any rectangular [Monopoly](https://www.shopplaywin.com/) game pieces, crops them, and runs them through a machine learning model which is trained to identify each game piece. Once identified, the app checks it against a list of rare pieces to see if you have anything that may be valuable.

### Image Processor Setup Instructions
```bash
# Enter image processor directory 
cd image-processor/

# Set up a virtualenv
virtualenv venv

# Install Dependencies
pip install -r requirements.txt

# Run scan script, which takes an input image and writes a bunch of output images to the output-images directory
python scan.py -i input-images/2018-sample-ticket.JPG

# The script finds all gamepieces (large rectangles), de-skews and de-warps them, outputting files along the way.
# - The squared whole gamepieces are saved as 3-warped-X.png, with X being the number of the gamepiece.
# - The 4 game strips on each game piece will be cropped and saved as individual files as 7-bY-manual-code-cropped-X.png, with X being the number of the game piece, and Y being the number of the game strip.
```

### TensorFlow Information
The model was created by following instructions in the [TensorFlow For Poets](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets/) tutorial with some slight modifications to the retraining script. The biggest issue I've found using this approach is having enough images of the rare pieces to train an effective model. Eventually, I'd like to use a low-shot learning approach, similar to this [ICCV challenge](http://www.msceleb.org/challenge2/2017) which identifies faces based on as few as one image. 