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

# The script finds all tickets (large rectangles), de-skews and de-warps them, outputting files along the way.
# - The squared whole tickets are saved as image-uploads/ticket/<UUID>_X.jpg, with X being the number of the ticket.
# - The 4 game strips on each game piece will be cropped and saved as individual files as image-uploads/piece/<UUID>_X_Y.jpg, with X being the number of the ticket, and Y being the number of the game strip.
```

### TensorFlow Information
The model was created by following instructions in the [TensorFlow For Poets](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets/) tutorial with some slight modifications to the retraining script. The biggest issue I've found using this approach is having enough images of the rare pieces to train an effective model. Eventually, I'd like to use a low-shot learning approach, similar to this [ICCV challenge](http://www.msceleb.org/challenge2/2017) which identifies faces based on as few as one image.

Retraining the model:
```
cd tensorflow-imagenet
IMAGE_SIZE=224
ARCHITECTURE="mobilenet_0.50_${IMAGE_SIZE}"
python3 -m scripts.retrain  --bottleneck_dir=tf_files/bottlenecks  --how_many_training_steps=500  --model_dir=tf_files/models/  --summaries_dir=tf_files/training_summaries/"${ARCHITECTURE}"  --output_graph=tf_files/retrained_graph.pb  --output_labels=tf_files/retrained_labels.txt  --architecture="${ARCHITECTURE}"  --image_dir=tf_files/monopoly-pieces
```

### Development
- On OSX, simply run `yarn start` to start the UI. 
  - If you are intending to use a mobile phone against your dev server on a LAN, and you are on a platform other than OSX, you will need to modify `bin/set_dev_env.sh` to extract your machines LAN IP before starting webpack. 
  - If you are developing entirely on your laptop and not testing with another device, just run `yarn start-local-only`.
- See `ecosystem.config.js` for how to run the backend services that power the image transformation and TensorFlow processing.

### Deployment
- The script at `bin/install.sh` will install dependencies and start the required API daemons, targeted toward a Ubuntu machine.
- The script at `bin/deplopy.sh` will login to the API server, fetch any updates from the git repo, and restart the daemons.
- Sample Nginx and PSQL config files are provided