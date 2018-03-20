from glob import glob
from os.path import join, basename

rare_list = ['108AH', '110BB', '116BH', '119CC', '121DA', '126EB', '132FD', '135GC', '138HB', '144JD', '145KA', '149LA', '154MB', '159NC', '164OD', '166PB', '172QD', '173RA', '179SC', '181TA', '182TB', '189VD', '190VE', '193WC', '194WD', '199XD', '200XE', '203YB', '206YE', '207ZA', '209ZC', '213AB', '218BC', '220CA', '227DD', '228EA', '235DS', '237GB', '242HC']

folder = 'tf_files/monopoly_photos'

for dir in glob(join(folder, '*')):
    dir = basename(dir)
    if dir in rare_list:
        print "rare piece %s" % dir