import { getAuth, signInAnonymously } from "firebase/auth"
import {
    getFirestore, collection, addDoc, setDoc, DocumentReference, DocumentData,
    doc, getDoc, getDocs, query, where, limit, startAfter, orderBy, DocumentSnapshot, QuerySnapshot,
    updateDoc, deleteDoc // arrayUnion, arrayRemove
} from 'firebase/firestore'
import { letters, unwantedCharacters, unwantedWords, vowels } from "./Unwanteds"

export const appname = 'alameenmission'
export const apptype = 'school'

const signin = async () => {
    try {
        await signInAnonymously(getAuth())
    } catch (ex) {
        console.log(ex)
    }
}

/**
 * Remove apostrophee-s and extra white-spaces and special-characters
 * @param {string} _searchkey
 * @returns {string}
 */
const refinedSearchkey = (_searchkey) => {
    let searchkey = _searchkey.toLowerCase().trim().split("'s").join("").split("  ").join(" ").split("  ").join(" ")
    unwantedCharacters.forEach(ch => { searchkey = searchkey.split(ch).join(" ") })
    return searchkey
}

/**
 * Removes aritcles, prepositions, pronouns, be verbs
 * Replace misplaced vowels
 * Must refinedSearchkey(_searchkey) before calling this for better result
 * @param {string} _searchkey
 * @returns {string}
 */
const wrongSearchkey = (_searchkey) => {
    let searchkey = _searchkey
    unwantedWords.forEach(word => { searchkey = searchkey.split(" " + word + " ").join(" ") })
    letters.forEach(letter => { searchkey = searchkey.split(letter + letter).join(letter) })
    vowels.forEach(vowel => { searchkey = searchkey.split(vowel).join("a") })
    searchkey = searchkey.split('aa').join('a').split("z").join("s")
    return searchkey
}

/**
 * @param {string} _searchkey
 * @returns {Array<string>}
 */
const getSearchkeys = (_searchkey) => {
    //these keys are searched with refined searchkeys
    const searchkey = refinedSearchkey(_searchkey)
    const searchkeys = [searchkey]
    const words = searchkey.split(" ")
    let subKey = ''
    let mergeKey = ''
    let dualKey = ''
    if (words.length > 1) {
        words.forEach(word => {
            if (!searchkeys.includes(word)) searchkeys.push(word)
            if (word.length > 4) subKey = word.substring(0, 3)
            if (!searchkeys.includes(subKey)) searchkeys.push(subKey)
            mergeKey += ' ' + word
            mergeKey = mergeKey.trim()
            if (!searchkeys.includes(mergeKey)) searchkeys.push(mergeKey)
            dualKey += ' ' + word
            if (!searchkeys.includes(dualKey)) searchkeys.push(dualKey)
            dualKey = word
        })
    }
    //these keys are searched with wrong searchkeys
    const searchkey2 = wrongSearchkey(searchkey)
    if (!searchkeys.includes(searchkey2)) searchkeys.push(searchkey2)
    const words2 = searchkey2.split(" ")
    subKey = ''
    mergeKey = ''
    dualKey = ''
    if (words2.length > 1) {
        words2.forEach(word => {
            if (!searchkeys.includes(word)) searchkeys.push(word)
            if (word.length > 4) subKey = word.substring(0, 3)
            if (!searchkeys.includes(subKey)) searchkeys.push(subKey)
            mergeKey += ' ' + word
            mergeKey = mergeKey.trim()
            if (!searchkeys.includes(mergeKey)) searchkeys.push(mergeKey)
            dualKey += ' ' + word
            if (!searchkeys.includes(dualKey)) searchkeys.push(dualKey)
            dualKey = word
        })
    }
    return searchkeys.filter(s => s !== '')
}

/**
 * @param {string} subscriberdocid 
 * @param {string} _collection 
 * @param {any} _data
 * @param {Array<string>} _searchkeys
 * @returns {Promise<DocumentReference<DocumentData>>}
 */
export const insertIntoFirestore = async (subscriberdocid, _collection, _data, _searchkeys) => {
    if (!_collection || !_data) return null
    await signin()
    let _searchkey = null
    let zkeys = []
    if (_searchkeys && _searchkeys.length > 0) {
        _searchkey = _searchkeys[0]
        _searchkeys.forEach((sk, i) => {
            if (i > 0 && !zkeys.includes(sk)) {
                zkeys.push(sk)
            }
        })
        const sks = getSearchkeys(_searchkey)
        if (sks && sks.length > 0) {
            sks.forEach(sk => {
                if (!zkeys.includes(sk)) {
                    zkeys.push(sk)
                }
            })
        }
    }
    const date = new Date()
    const timestamp = date.getTime()
    const data = _searchkey
        ? { ..._data, createdon: timestamp, modifiedon: timestamp, appname, apptype, subscriberdocid, zkeys }
        : { ..._data, createdon: timestamp, modifiedon: timestamp, appname, apptype, subscriberdocid }
    try {
        return await addDoc(collection(getFirestore(), _collection), data);
    } catch (ex) {
        return null
    }
}

/**
 * @param {string} subscriberdocid 
 * @param {string} docid 
 * @param {string} _collection 
 * @param {any} _data
 * @param {Array<string>} _searchkeys
 * @returns {Promise<DocumentReference<DocumentData>>}
 */
export const insertIntoFirestoreByDocid = async (subscriberdocid, docid, _collection, _data, _searchkeys) => {
    if (!_collection || !_data) return null
    await signin()
    let _searchkey = null
    let zkeys = []
    if (_searchkeys && _searchkeys.length > 0) {
        _searchkey = _searchkeys[0]
        _searchkeys.forEach((sk, i) => {
            if (i > 0 && !zkeys.includes(sk)) {
                zkeys.push(sk)
            }
        })
        const sks = getSearchkeys(_searchkey)
        if (sks && sks.length > 0) {
            sks.forEach(sk => {
                if (!zkeys.includes(sk)) {
                    zkeys.push(sk)
                }
            })
        }
    }
    const date = new Date()
    const timestamp = date.getTime()
    const data = _searchkey
        ? { ..._data, createdon: timestamp, modifiedon: timestamp, appname, apptype, subscriberdocid, zkeys }
        : { ..._data, createdon: timestamp, modifiedon: timestamp, appname, apptype, subscriberdocid }
    try {
        const docref = doc(getFirestore(), _collection, docid)
        await setDoc(docref, data)
        return docref
    } catch (ex) {
        return null
    }
}

/**
 * @param {DocumentReference} _docref 
 * @param {any} _data //arrayUnion, arrayRemove can be used as needs
 * @param {Array<string>} _searchkeys
 * @returns {Promise<boolean>} 
 */
export const updateIntoFirestore = async (_docref, _data, _searchkeys = null) => {
    if (!_docref || !_data) return null
    await signin()
    let _searchkey = null
    let zkeys = []
    if (_searchkeys && _searchkeys.length > 0) {
        _searchkey = _searchkeys[0]
        _searchkeys.forEach((sk, i) => {
            if (i > 0 && !zkeys.includes(sk)) {
                zkeys.push(sk)
            }
        })
        const sks = getSearchkeys(_searchkey)
        if (sks && sks.length > 0) {
            sks.forEach(sk => {
                if (!zkeys.includes(sk)) {
                    zkeys.push(sk)
                }
            })
        }
    }
    const date = new Date()
    const timestamp = date.getTime()
    const data = _searchkey
        ? { ..._data, modifiedon: timestamp, zkeys }
        : { ..._data, modifiedon: timestamp }
    try {
        console.log('updating: ' + timestamp)
        await updateDoc(_docref, data)
        return true
    } catch (ex) {
        return false
    }
}

/**
 * @param {DocumentReference} _docref 
 * @returns {Promise<boolean>} 
 */
export const deleteFromFirestore = async (_docref) => {
    if (!_docref) return null
    await signin()
    try {
        await deleteDoc(_docref)
        // console.log('Delete success')
        return true
    } catch (ex) {
        // console.log('Delete error:', ex)
        return false
    }
}

/**
 * @param {string} _collection
 * @param {string} _docid 
 * @returns {Promise<DocumentSnapshot<DocumentData>>}
 */
export const fetchFromFirestoreByDocid = async (_collection, _docid) => {
    await signin()
    try {
        return await getDoc(doc(getFirestore(), _collection, _docid))
    } catch (ex) {
        return null
    }
}

/**
 * @param {string} _collection 
 * @param {Array<{field: string, operator: "<"| "<="|"=="|">"|">="|"!="|"array-contains"|"array-contains-any"|"in"|"not-in", value: string | Array<string> }>} _where 
 * @param {Array<{field: string, order: 'asc'|'desc'}>} _orderby 
 * @param {DocumentSnapshot<DocumentData>} _startAfter 
 * @param {number} _limit 
 * @returns {Promise<QuerySnapshot<DocumentData>>}
 */
export const fetchFromFirestore = async (_collection, _where, _orderby, _startAfter, _limit) => {
    if (!_collection || !_where) return null
    await signin()
    const _queryConstraint = []
    if (_where && _where.length > 0) {
        _where.map(w => _queryConstraint.push(where(w.field, w.operator, w.value)))
    }
    if (_orderby && _orderby.length > 0) {
        _orderby.map(o => _queryConstraint.push(orderBy(o.field, o.order)))
    }
    if (_startAfter) {
        _queryConstraint.push(startAfter(_startAfter))
    }
    if (_limit) {
        _queryConstraint.push(limit(_limit))
    }
    const _query = query(collection(getFirestore(), _collection), ..._queryConstraint)
    try {
        return await getDocs(_query)
    } catch (ex) {
        console.log(ex)
        return null
    }
}

/**
 * Subscriber specific fetching 
 * The index must starts with appname, subscriberdocid
 * @param {string} subscriberdocid 
 * @param {string} _collection 
 * @param {Array<{field: string, operator: "<"| "<="|"=="|">"|">="|"!="|"array-contains"|"array-contains-any"|"in"|"not-in", value: string | Array<string> }>} _where 
 * @param {Array<{field: string, order: 'asc'|'desc'}>} _orderby 
 * @param {DocumentSnapshot<DocumentData>} _startAfter 
 * @param {number} _limit 
 * @returns {Promise<QuerySnapshot<DocumentData>>}
 */
export const fetchFromFirestoreBySubscriber = async (subscriberdocid, _collection, _where, _orderby, _startAfter, _limit) => {
    if (!_collection) return null
    const where = [
        { field: 'appname', operator: '==', value: appname },
        { field: 'subscriberdocid', operator: '==', value: subscriberdocid },
    ]
    if (_where) {
        _where.forEach(w => where.push(w))
    }
    return await fetchFromFirestore(_collection, where, _orderby, _startAfter, _limit)
}

/**
 * @param {string} _collection 
 * @param {string} _searchkey 
 * @param {Array<{field: string, order: 'asc'|'desc'}>} _orderby 
 * @param {DocumentSnapshot<DocumentData>} _startAfter 
 * @param {number} _limit 
 * @returns {Promise<QuerySnapshot<DocumentData>>}
 */
export const searchFromFirestore = async (_collection, _searchkey, _orderby, _startAfter, _limit) => {
    if (!_collection || !_searchkey) return null
    const searchkey = refinedSearchkey(_searchkey)
    const searchkey2 = wrongSearchkey(searchkey)
    const where = [
        { field: 'zkeys', operator: 'array-contains-any', value: [searchkey, searchkey2] }
    ]
    return await fetchFromFirestore(_collection, where, _orderby, _startAfter, _limit)
}

/**
 * Subscriber specific searching 
 * The index must starts with appname, subscriberdocid
 * @param {string} subscriberdocid 
 * @param {string} _collection 
 * @param {string} _searchkey 
 * @param {Array<{field: string, order: 'asc'|'desc'}>} _orderby 
 * @param {DocumentSnapshot<DocumentData>} _startAfter 
 * @param {number} _limit 
 * @returns {Promise<QuerySnapshot<DocumentData>>}
 */
export const searchFromFirestoreBySubscriber = async (subscriberdocid, _collection, _searchkey, _orderby, _startAfter, _limit) => {
    if (!_collection || !_searchkey) return null
    const searchkey = refinedSearchkey(_searchkey)
    const searchkey2 = wrongSearchkey(searchkey)
    const where = [
        { field: 'appname', operator: '==', value: appname },
        { field: 'subscriberdocid', operator: '==', value: subscriberdocid },
        { field: 'zkeys', operator: 'array-contains-any', value: [searchkey, searchkey2] }
    ]
    return await fetchFromFirestore(_collection, where, _orderby, _startAfter, _limit)
}
