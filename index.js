let fs = require('fs');
let stdin = process.stdin;
let stdout = process.stdout;
let stats = [];
let currDirFiles = [];
let currDirAddress = process.cwd();

function readDir(dirAddress) {
  fs.readdir(dirAddress, (err, files) => {
    if (err) return console.error(err);

    currDirFiles = files;
    stats = [];
    showFileInDirector(files, 0, dirAddress);
  })
}
// 读取后的操作函数
function option(fileIndex) {
  let filename = currDirFiles[Number(fileIndex)];
  if (!filename) {
    stdout.write('    \033[31mEnter your choice: \033[39m\n');
  } else {
    stdin.pause();
    stdin.off('data', option);

    const address = `${currDirAddress}/${filename}`;
    if (stats[Number(fileIndex)].isDirectory()) {
      currDirAddress = address
      readDir(currDirAddress);
    } else {
      fs.readFile(address, 'utf8', (err, data) => {
        if (err) return console.error(err);
        console.log('');
        console.log('\033[90m'+data.replace(/(.*)/g, '    $1')+'\033[39m');
      })
    }
  }
}
// 抽离读取函数
function getDataFromKeybord() {
  console.log('');
  stdout.write('    \033[33mEnter your choice: \033[39m\n');
  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', option);
}
function showFileInDirector(files, i, dirAddress) {
  let filename = files[i];

  fs.stat(`${dirAddress}/${filename}`, (err, stat) => {
    stats[i] = stat;
    if (err) return console.error(err);

    // 文件夹和文件用不同颜色区分
    if (stat.isDirectory()) {
      console.log('    '+i+'   \033[36m '+filename+'/\033[39m\n');
    } else {
      console.log('    '+i+'   \033[90m '+filename+'/\033[39m\n');
    }

    i++;
    if (i == files.length) {
      getDataFromKeybord();
    } else {
      showFileInDirector(files, i, dirAddress);
    }
  })
}
fs.readdir(currDirAddress, (err, files) => {
  if (err) return console.error(err);
  currDirFiles = files;
  console.log('');

  if (!files.length) {
    return console.log('    \033[31m No files to show!\033[39m\n');
  }

  console.log('   Select which file or directory you want to see\n');

  stats = [];
  showFileInDirector(files, 0, currDirAddress);
})