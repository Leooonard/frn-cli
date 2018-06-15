const convert = (xPrdList) => {
    let prds = []
    xPrdList.forEach((xPrd) => {
        let prd = {
            segno: xPrd.segno,
            imgs: [],
            description: [],
            instruction: [],
            rules: [],
            restName: ''
        };

        xPrd.xpdtnote.forEach((note) => {
            const noteObj = {
                noteTit: note.noteTit || '',
                noteCnt: note.noteCnt || ''
            }
            switch (note.noteType) {
                case 1:
                  prd.imgs.push(noteObj)
                  break
                case 2:
                  prd.description.push(noteObj)
                  break
                case 3:
                  noteObj.noteCnt = noteObj.noteCnt.replace('<br />', '')
                  prd.instruction.push(noteObj)
                  break
                case 4:
                  prd.rules.push(noteObj)
                  break
                case 5:
                  prd.restName = noteObj.noteCnt
                  break
            }
        });
        prds.push(prd)
    });
    return prds
  }
  
  export { convert }