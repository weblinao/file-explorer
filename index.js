let fs = require('fs');
let stdin = process.stdin;
let stdout = process.stdout;
let stats = [];

fs.readdir(process.cwd(), (err, files) => {
  console.log('');

  if (!files.length) {
    return console.log('    \033[31m No files to show!\033[39m\n');
  }

  console.log('   Select which file or directory you want to see\n');

  function option(data) {
    let filename = files[Number(data)];
    if (!filename) {
      stdout.write('    \033[31mEnter your choice: \033[39m\n');
    } else {
      stdin.pause();
      fs.readFile(`${__dirname}/${filename}`, 'utf8', (err, data) => {
        console.log('');
        console.log('\033[90m'+data.replace(/(.*)/g, '    $1')+'\033[39m');
      })
    }
  }
  function read() {
    console.log('');
    stdout.write('    \033[33mEnter your choice: \033[39m\n');
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', option);
  }
  function file(i) {
    let filename = files[i];

    fs.stat(`${__dirname}/${filename}`, (err, stat) => {
      stats[i] = stat;
      if (err) return console.error(err);

      if (stat.isDirectory()) {
        console.log('    '+i+'   \033[36m '+filename+'/\033[39m\n');
      } else {
        console.log('    '+i+'   \033[90m '+filename+'/\033[39m\n');
      }

      i++;
      if (i == files.length) {
        read();
      } else {
        file(i);
      }
    })
  }
  file(0);
})