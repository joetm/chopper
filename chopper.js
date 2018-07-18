#!/usr/bin/env node
!function(){

  const puppeteer = require('puppeteer');
  const fs = require('fs');
  const argv = require('yargs').argv;
  const ON_DEATH = require('death')({uncaughtException: true});

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


  // check cmd arguments for url
  if (process.argv[2] === undefined) {
    console.error('Missing arguments. Run as: ./chopper.js <URL> <SELECTOR>.');
    process.exit();
  }
  const URL = process.argv[2];


  // what to extract?
  // defaults
  let DIV_TO_QUERY = 'div';
  if (process.argv[3] !== undefined) {
    DIV_TO_QUERY = process.argv[3];
  }


  console.log(`Generating screenshots for ${DIV_TO_QUERY} from ${URL}`);


  // clear the img folder first
  const IMGDIR = './img/';
  rmDir(IMGDIR);
  if (!fs.existsSync(IMGDIR)){
    fs.mkdirSync(IMGDIR);
  }


  (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(URL);
      // await page.screenshot({path: 'example.png'})

      const elements = await page.$$(DIV_TO_QUERY);
      // console.log(elements[0])

      let counter = 0;
      for (const element of elements) {
        counter++;

        // console.log(element);

        // --lorem or --replace arguments
        // if (argv.lorem || argv.replace) {
        //   // replace any texts with lorem ipsum
        //   element.getProperty('innerHTML').then(txt => {
        //     txt.jsonValue().then(p => {
        //       let replTxt = p.replace(/<.*>/ig, "");
        //       const txtLength = replTxt.length;
        //       // pure text element?
        //       if (txtLength === p.length) {
        //         // replacement
        //         replTxt = replTxt.replace(/[a-z]/ig, "X");
        //         console.log('pure text element:', replTxt);
        //       } //if
        //     }); //jsonValue
        //   }); //getProperty
        // } //if

        const bbox = await element.boundingBox();
        if (!bbox || !bbox.width || !bbox.height) {
          console.log(bbox, '... skipping.');
          continue;
        }
        console.log(bbox);

        const screenshot = await page.screenshot({
          'path': `./img/test-${counter}.png`,
          'fullPage': false,
          'clip': {
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
          },
        });
      }

      await browser.close();
  })();

}();
