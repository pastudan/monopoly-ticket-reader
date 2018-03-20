import glob, os, shutil

folder = 'tf_files/monopoly_photos'

for file_path in glob.glob(os.path.join(folder, '*.*')):
    new_dir = file_path.rsplit('.', 1)[0]
    try:
        print('making ' + new_dir)
        os.mkdir(os.path.basename(new_dir))
    except:
        print('making ' + new_dir)
        # Handle the case where the target dir already exist.
        raise
    shutil.move(file_path, os.path.join(new_dir, os.path.basename(file_path)))