import fs from 'fs';
function removeFile(path){
fs.unlink(path, (err) => {
  if (err) {
    console.error(err)
    return
  }
})
}

export default removeFile;