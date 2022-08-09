import jwt from 'jsonwebtoken'
const admins =
    [
        { 'appname': 'alameenmission', 'email': 'aaak.academic@gmail.com', 'institute': 'Al-Ameen Academy, Kalna', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-PURBABARDHAMAN-KALNA' },
        { 'appname': 'alameenmission', 'email': 'murtujaalam1978@gmail.com', 'institute': 'Al-Ameen Academy, Bankura', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-BANKURA-BANKURA' },
        { 'appname': 'alameenmission', 'email': 'aamaujunia@gmail.com', 'institute': 'Al-Ameen Mission Academy, Ujunia', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-MURSHIDABAD-UJUNIA' },
        { 'appname': 'alameenmission', 'email': 'alameenacademykelejora@gmail.com', 'institute': 'Al-Ameen Academy Kelejora', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-PASCHIMBARDHAMAN-KELEJORA' },
        { 'appname': 'alameenmission', 'email': 'aama2012nayabaz@gmail.com', 'institute': 'Al-Ameen Mission Academy, Nayabaz', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-HOWRAH-NAYABAZ' },
        { 'appname': 'alameenmission', 'email': 'aaeasantragachi@gmail.com', 'institute': 'Al-Ameen Excellent Academy,Santragachi', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-HOWRAH-SANTRAGACHI' },
        { 'appname': 'alameenmission', 'email': 'patharchapuri786@gmail.com', 'institute': 'Al-Ameen Mission, Patharchapuri', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-BIRBHUM-PATHARCHAPURI' },
        { 'appname': 'alameenmission', 'email': 'aaasugarh2013@gmail.com', 'institute': 'Al-Ameen Academy, Sugarh', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-BIRBHUM-SUGARH' },
        { 'appname': 'alameenmission', 'email': 'aamamalda355@gmail.com', 'institute': 'Al-Ameen Mission Academy,Malda', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-MALDA-MALDA' },
        { 'appname': 'alameenmission', 'email': 'suribranchaam@gmail.com', 'institute': 'Al-Ameen Mission Academy, Suri', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-BIRBHUM-SURI' },
        { 'appname': 'alameenmission', 'email': 'aaapapuri14@gmail.com', 'institute': 'Al-Ameen Academy, Galsi', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-PURBABARDHAMAN-GALSI' },
        { 'appname': 'alameenmission', 'email': 'aaapapuri14@gmail.com', 'institute': 'Al-Ameen Academy, Papuri', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-BIRBHUM-PAPURI' },
        { 'appname': 'alameenmission', 'email': 'burdwanacademy786@gmail.com', 'institute': 'Al-Ameen Academy, Burdwan', 'role': 'BRANCH ADMIN', 'subscriberdocid': 'ALAMEENMISSION-PURBABARDHAMAN-BURDWANGIRLS' },
    ]

export const uploadAdminData = () => {
    const x = []
    admins.forEach(admin => {
        x.push({ ...admin, password: jwt.sign(admin.email, admin.email + admin.subscriberdocid) })
    })
    console.log(JSON.stringify(x))
}

const final =
    [
        "alameenmission", "aaak.academic@gmail.com", "Al-Ameen Academy, Kalna", "BRANCH ADMIN", "ALAMEENMISSION-PURBABARDHAMAN-KALNA", "eyJhbGciOiJIUzI1NiJ9.YWFhay5hY2FkZW1pY0BnbWFpbC5jb20.Qn-OKttKzSBQ2lWSCLwzmA30InqGp0QdMIxlmjs-PVg" 
 "alameenmission", "murtujaalam1978@gmail.com", "Al-Ameen Academy, Bankura", "BRANCH ADMIN", "ALAMEENMISSION-BANKURA-BANKURA", "eyJhbGciOiJIUzI1NiJ9.bXVydHVqYWFsYW0xOTc4QGdtYWlsLmNvbQ.UollKgbnH77x-XJzjWCmwUTEjvJdBvVfwB7RiPu4294" 
 "alameenmission", "aamaujunia@gmail.com", "Al-Ameen Mission Academy, Ujunia", "BRANCH ADMIN", "ALAMEENMISSION-MURSHIDABAD-UJUNIA", "eyJhbGciOiJIUzI1NiJ9.YWFtYXVqdW5pYUBnbWFpbC5jb20.RrLWwLv7X1hrHPhwH2tZKmy2fonm3OtkOYgUqsc8Uho" 
 "alameenmission", "alameenacademykelejora@gmail.com", "Al-Ameen Academy Kelejora", "BRANCH ADMIN", "ALAMEENMISSION-PASCHIMBARDHAMAN-KELEJORA", "eyJhbGciOiJIUzI1NiJ9.YWxhbWVlbmFjYWRlbXlrZWxlam9yYUBnbWFpbC5jb20.24hitKqg-op2c-xHzvemSVOJnL79CJj24iWf18mxC34" 
 "alameenmission", "aama2012nayabaz@gmail.com", "Al-Ameen Mission Academy, Nayabaz", "BRANCH ADMIN", "ALAMEENMISSION-HOWRAH-NAYABAZ", "eyJhbGciOiJIUzI1NiJ9.YWFtYTIwMTJuYXlhYmF6QGdtYWlsLmNvbQ.1u4iYdRIkkBmvDQRMI9WRsAD6todt9F-qlW-tvwBqDU" 
 "alameenmission", "aaeasantragachi@gmail.com", "Al-Ameen Excellent Academy,Santragachi", "BRANCH ADMIN", "ALAMEENMISSION-HOWRAH-SANTRAGACHI", "eyJhbGciOiJIUzI1NiJ9.YWFlYXNhbnRyYWdhY2hpQGdtYWlsLmNvbQ.HqMwX3Oo790C2md_zr6x75aYvc_Ffju9hJV0FwP8FS8" 
 "alameenmission", "patharchapuri786@gmail.com", "Al-Ameen Mission, Patharchapuri", "BRANCH ADMIN", "ALAMEENMISSION-BIRBHUM-PATHARCHAPURI", "eyJhbGciOiJIUzI1NiJ9.cGF0aGFyY2hhcHVyaTc4NkBnbWFpbC5jb20.UR2-8L9DxWJVGYelz6GPaZlBw6fkUMya0b8xeiXf_Vw" 
 "alameenmission", "aaasugarh2013@gmail.com", "Al-Ameen Academy, Sugarh", "BRANCH ADMIN", "ALAMEENMISSION-BIRBHUM-SUGARH", "eyJhbGciOiJIUzI1NiJ9.YWFhc3VnYXJoMjAxM0BnbWFpbC5jb20.nkQczGqonC7gaH4Z1Y65MApeH7wFya7NaOouT0M0GIY" 
 "alameenmission", "aamamalda355@gmail.com", "Al-Ameen Mission Academy,Malda", "BRANCH ADMIN", "ALAMEENMISSION-MALDA-MALDA", "eyJhbGciOiJIUzI1NiJ9.YWFtYW1hbGRhMzU1QGdtYWlsLmNvbQ.VfFvx0u70q53XiET2xbjLBpHGoE_MbW6OCfRwbgCMP4" 
 "alameenmission", "suribranchaam@gmail.com", "Al-Ameen Mission Academy, Suri", "BRANCH ADMIN", "ALAMEENMISSION-BIRBHUM-SURI", "eyJhbGciOiJIUzI1NiJ9.c3VyaWJyYW5jaGFhbUBnbWFpbC5jb20.HcqzsWW7a2P53XaoMOjGA-573_fJmwqk1k7VnruBMGM" 
 "alameenmission", "aaapapuri14@gmail.com", "Al-Ameen Academy, Galsi", "BRANCH ADMIN", "ALAMEENMISSION-PURBABARDHAMAN-GALSI", "eyJhbGciOiJIUzI1NiJ9.YWFhcGFwdXJpMTRAZ21haWwuY29t.BJYrzYn3bdYTC0GqYL1fnNFul9rzAH8KlYic32svoEY" 
 "alameenmission", "aaapapuri14@gmail.com", "Al-Ameen Academy, Papuri", "BRANCH ADMIN", "ALAMEENMISSION-BIRBHUM-PAPURI", "eyJhbGciOiJIUzI1NiJ9.YWFhcGFwdXJpMTRAZ21haWwuY29t.LhB8zqXbwc3DciGgocmK0AXWsKhX_oqVdBPSP_KOVbc" 
 "alameenmission", "burdwanacademy786@gmail.com", "Al-Ameen Academy, Burdwan", "BRANCH ADMIN", "ALAMEENMISSION-PURBABARDHAMAN-BURDWANGIRLS", "eyJhbGciOiJIUzI1NiJ9.YnVyZHdhbmFjYWRlbXk3ODZAZ21haWwuY29t.Ur5WAPzlMxzetJkrqzsytbtVhjw7KqfHajYIXUaQpKw"
    ]
