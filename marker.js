#!/usr/bin/env node
!function(){

  const fs = require('fs');
  const path = require('path');
  const jpeg = require('jpeg-js');
  const drawing = require('pngjs-draw');
  const png = drawing(require('pngjs').PNG);
  const argv = require('yargs').argv;
  const ON_DEATH = require('death')({uncaughtException: true});

  const prefix = 'img';
  const _OUTPUTDIR = './img/marked';
  const _DIR = './img';

  // detect Ctrl+C
  ON_DEATH(function(signal, err) {
    console.error(`Aborted by user. [${signal} ${err}]`);
    process.exit();
  });

  // https://gist.github.com/liangzan/807712/8fb16263cb39e8472d17aea760b6b1492c465af2
  const rmDir = function(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i];
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    fs.rmdirSync(dirPath);
  };

  filename = false
  // check cmd arguments for specific filename
  if (process.argv[2] !== undefined) {
    filename = process.argv[2]
    console.log(`Marking screenshot ${path.basename(filename)}`);
  } else {
    console.log(`Marking all screenshots in folder`);
  }

  // clear the img folder first
  if (fs.existsSync(_OUTPUTDIR)){
    rmDir(_OUTPUTDIR);
  }
  fs.mkdirSync(_OUTPUTDIR);


  (async () => {

    if (filename !== false) {

      jsonFile = `${_DIR}/${filename.replace('.png', '.json')}`;
      imgFile = `${_DIR}/${filename}`;

      // case: single file
      console.log(`Analysing ${imgFile}`);
      
      // try {
        const metainfo = require(jsonFile);
        console.log(`Marking elements in ${filename}`);
        // console.log(metainfo);

        let c = 0;

        // DEV - only first node
        const n = metainfo.nodes[2];
        console.log(n);
        console.log('===');

        // for (const node of metainfo.nodes) {
          c = c + 1;

          // case 1: input is jpg
          // const jpegData = fs.readFileSync(imgFile);
          // console.log(jpegData);
          // const rawImageData = jpeg.decode(jpegData);
          // console.log(rawImageData);

          // case 2: input is png
          fs.createReadStream(imgFile)
            .pipe(new png({ filterType: 4 }))
            .on('parsed', function() {

          // const data = fs.readFileSync(imgFile);
          // const parsedImg = png.sync.read(data);
          // const options = { colorType: 6 };
          // const buffer = png.sync.write(parsedImg, options);
          // fs.writeFileSync('out.png', buffer);


              // Draw red box
              this.drawLine(
                n.offsetLeft,
                n.offsetTop,
                n.offsetLeft + n.width,
                n.offsetTop,
                this.colors.red(0))
              this.drawLine(
                n.offsetLeft + n.width,
                n.offsetTop,
                n.offsetLeft + n.width,
                n.offsetTop + n.height,
                this.colors.red(0))
              this.drawLine(
                n.offsetLeft,
                n.offsetTop,
                n.offsetLeft,
                n.offsetTop + n.height,
                this.colors.red(0))
              this.drawLine(
                n.offsetLeft,
                n.offsetTop + n.height,
                n.offsetLeft + n.width,
                n.offsetTop + n.height,
                this.colors.red(0))

              // Writes file
              const _OUTFILE = `${filename.replace('.png', "" + c + "-.png")}`;
              console.log(`...writing ${_OUTPUTDIR}/${_OUTFILE}`);
              this.pack().pipe(fs.createWriteStream(`${_OUTPUTDIR}/${_OUTFILE}`));
            })
            // .on('error', function(e) {
            //   console.error(`PNG parsing error [${e}]`)
            // });

        // }
      // }
      // catch(e) {
      //   console.error(`${e}`);
      //   process.exit();
      // }

    } else {

      // case: all files
      try { var files = fs.readdirSync(_DIR); }
      catch(e) { return; }

      // const elements = await page.$$(DIV_TO_QUERY);
      console.log(files);

    }



  })();

}();
