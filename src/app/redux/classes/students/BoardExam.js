import Marks from "./Marks"

export default class BoardExam {
    examName = ''
    board = ''
    institute = ''
    yearOfPassing = 0
    regNo = ''
    rollNo = ''
    marks = [new Marks()]//increasable list
    fullMarks = 0
    marksObtained = 0

    constructor(boardExam) {
        this.examName = boardExam && boardExam.examName ? boardExam.examName.toUpperCase() : ''
        this.board = boardExam && boardExam.board ? boardExam.board.toUpperCase() : ''
        this.institute = boardExam && boardExam.institute ? boardExam.institute.toUpperCase() : ''
        this.yearOfPassing = boardExam && boardExam.yearOfPassing ? (+ boardExam.yearOfPassing) : 0
        this.regNo = boardExam && boardExam.regNo ? boardExam.regNo.toUpperCase() : ''
        this.rollNo = boardExam && boardExam.rollNo ? boardExam.rollNo.toUpperCase() : ''
        this.marks = boardExam && boardExam.marks ? boardExam.marks.map(m => new Marks(m)) : []
        this.fullMarks = boardExam && boardExam.fullMarks ? (+ boardExam.fullMarks) : 0
        this.marksObtained = boardExam && boardExam.marksObtained ? (+ boardExam.marksObtained) : 0
    }

    json = () => {
        const { examName, board, institute, yearOfPassing, regNo, rollNo, fullMarks, marksObtained } = this
        const marks = this.marks.map(m => m.json())
        return ({ examName, board, institute, yearOfPassing, regNo, rollNo, marks, fullMarks, marksObtained })
    }
}