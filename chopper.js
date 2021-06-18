#!/usr/bin/env node
!function(){

  const puppeteer = require('puppeteer');
  const fs = require('fs');
  const argv = require('yargs').argv;
  const ON_DEATH = require('death')({uncaughtException: true});

  const IMGDIR = './img/';
  const prefix = 'img';

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

  // https://stackoverflow.com/a/442474/426266
  // const getOffset = function(el) {
  //     var _x = 0;
  //     var _y = 0;
  //     while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
  //         _x += el.offsetLeft - el.scrollLeft;
  //         _y += el.offsetTop - el.scrollTop;
  //         el = el.offsetParent;
  //     }
  //     return { top: _y, left: _x };
  // }

  // check cmd arguments for url
  if (process.argv[2] === undefined) {
    console.error('Missing arguments. Run as: ./chopper.js <URL> <SELECTOR>.');
    process.exit();
  }
  const URL = process.argv[2];


  // what to extract?
  // defaults to div
  let DIV_TO_QUERY = 'div';
  if (process.argv[3] !== undefined) {
    DIV_TO_QUERY = process.argv[3];
  }


  console.log(`Generating screenshots for ${DIV_TO_QUERY} from ${URL}`);


  // clear the img folder first
  rmDir(IMGDIR);
  if (!fs.existsSync(IMGDIR)){
    fs.mkdirSync(IMGDIR);
  }


  (async () => {
  try {

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(URL);
      // await page.screenshot({path: 'example.png'})

      const elements = await page.$$(DIV_TO_QUERY);
      // console.log(elements[0])

      let counter = 0;
      for (const element of elements) {
        counter++;

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

        const filename = `${prefix}-${counter}`;

        const screenshot = await page.screenshot({
          'path': `./img/${filename}.png`,
          'fullPage': false,
          'clip': {
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
          },
        });


        // capture the properties of all elements inside the current one

        const divCount = await element.$$eval('div', divs => divs.length );

        // const innerNodes = await element.$$('*');
        const innerNodes = await element.$$eval('*', els => {
          return els.map(el => {
            // let _x = 0;
            // let _y = 0;
            // while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            //     _x += el.offsetLeft - el.scrollLeft;
            //     _y += el.offsetTop - el.scrollTop;
            //     el = el.offsetParent;
            // }
            return {
              width: el.width || el.clientWidth,
              height: el.height || el.clientHeight,
              offsetTop: el.offsetTop,
              offsetLeft: el.offsetLeft,
              style: getComputedStyle(el),
              // left: _x,
              // top: _y,
              // html: el.outerHTML,
            };
          });
        });

        // console.log('=====');
        // console.log(innerNodes);

        // for (const n of innerNodes) {
        //   console.log('=====');
        //   console.log(n);
        // }

        // const nodes = []

        // save the metadata
        const metadata = {
          filename: `${filename}.png`,
          bbox,
          divCount,
          nodes: innerNodes,
          contents: [],
        }

        // console.log(metadata);

        fs.writeFile(`./img/${filename}.json`, JSON.stringify(metadata), 'utf8', () => {
          // console.log(`written ${filename}.json`);


        });

      }

      await browser.close();

  } catch (error) {
    console.error(error);
  }
  })();

}();
