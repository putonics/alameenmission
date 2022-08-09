import ClassWiseStudents from "./ClassWiseStudents"

export default class StudentCountReport {
    appname = ''
    subscriberdocid = ''
    sessionFrom = 0
    /**
     * @type {Array<ClassWiseStudents>}
     */
    classWiseStudents
    docref

    constructor(scr) {
        this.appname = scr && scr.appname ? scr.appname : ''
        this.subscriberdocid = scr && scr.subscriberdocid ? scr.subscriberdocid : ''
        this.sessionFrom = scr && scr.sessionFrom ? scr.sessionFrom : 0
        this.classWiseStudents = scr && scr.classWiseStudents ? scr.classWiseStudents.map((cws) => new ClassWiseStudents(cws)) : []
        this.docref = scr && scr.docref ? scr.docref : null
    }

    set = (scr) => {
        this.appname = scr && scr.appname ? scr.appname : ''
        this.subscriberdocid = scr && scr.subscriberdocid ? scr.subscriberdocid : ''
        this.sessionFrom = scr && scr.sessionFrom ? scr.sessionFrom : 0
        this.classWiseStudents = scr && scr.classWiseStudents ? scr.classWiseStudents.map((cws) => new ClassWiseStudents(cws)) : []
    }

    json = () => {
        const { appname, subscriberdocid, sessionFrom } = this
        const classWiseStudents = this.classWiseStudents.map((cws) => cws.json())
        return ({ appname, subscriberdocid, sessionFrom, classWiseStudents })
    }
}