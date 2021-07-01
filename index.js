const youtubedl = require('youtube-dl')
const readline = require('readline');
const fs = require("fs")
colors = require("colors")
//Logging improved
__originalLog = console.log;
console.log = function () {
    var args = [].slice.call(arguments);
    __originalLog.apply(console.log, [" [+] ".magenta].concat(args));
};
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}
async function t(){
    try{
        var counter = 0;
        var extratext = `Waiting for user input`;
        var myvar = setInterval(()=>{
            var arr = ["/", "-", "\\", "|",]; 
            require("node-bash-title")(`[ ${arr[counter]} ] ${extratext} ${".".repeat(counter)}`)
            counter++;
            if(counter == arr.length) counter = 0;
          }, 350)
        console.log("Example Link: ".green + "https://youtu.be/6xDyPcJrl0c".yellow + " or: ".green + "https://www.youtube.com/watch?v=fJ9rUzIMcZQ".yellow+ "\n\n") 
        const ans = await askQuestion(" [+] ".magenta + "Paste the YOUTUBE LINK: ".brightYellow);

        extratext = `Getting Video Data`;

        //https://youtu.be/6xDyPcJrl0c

        var output = 'myvideo.mp4'
        let downloaded = 0
        const video = youtubedl(ans, ['--format=18', '-f', "best[ext=mp4]/best"], { start: downloaded, cwd: __dirname })
        video.on('info', function(info) {
          //console.log('\033[2J'); --> if you wanna remove the input part (i want to keep it so i commented it out)
          console.log('Download started'.brightGreen)
          output = "./videos/" + info._filename.split(" ").join("_").replace(/[&\/\\#!,+()$~%.'\s":*?<>{}]/g,'_').substr(0, 30) + ".mp4";
          if (fs.existsSync(output)) {
              fs.unlinkSync(output)
              fs.openSync(output, "w")
          }
          else fs.openSync(output, "w")
          console.log('FILENAME: '.brightGreen + String(output).brightYellow)
          let total = info.size + downloaded
          console.log('SIZE: '.brightGreen + String(Math.floor(Number(total)/1000)/100+" Mbits").brightYellow)
          video.pipe(fs.createWriteStream(output, { flags: 'a' }))
          
          extratext = `Downloading`
        })
        video.on('complete', function complete(info) {
          'use strict'
          console.log(String('filename: ' + info._filename + ' already Downloaded.').brightGreen)
        })
        video.on('end', function() {
          clearInterval(myvar);
          require("node-bash-title")(`Downloaded: ${output}`)
          console.log('Finished Downloading!'.bold.brightGreen)
          require('child_process').exec('start "" "videos"');
          console.log("closing Exe File in 3 Seconds ...".grey)
          setTimeout(()=>{
              return console.log("CLOSED")
          }, 3000)
        })
    }catch(e){
        console.log(e)
    }
} 
t();