const fs = require('fs');
const PgClient = require('pg').Client
const pgClient = new PgClient()
pgClient.connect()

async function copyFiles () {
  const data = await pgClient.query('select * from pieces where human_label is not null')

  data.rows.forEach(row => {
    const dir = `tensorflow-imagenet/tf_files/monopoly-pieces/${row.human_label}`
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    fs.createReadStream(`image-uploads/piece/${row.piece_id}.jpg`).pipe(fs.createWriteStream(`${dir}/${row.piece_id}.jpg`));
  })
}

copyFiles();
