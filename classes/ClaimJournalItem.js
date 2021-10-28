export class ClaimJournalItem {
    /* Дата записи */
    set fromDate(fromDate){ this._fromDate = fromDate; }
    get fromDate(){ return this._fromDate; }    
    /* тип записи */
    set type(type){ this._type = type; }
    get type(){ return this._type; }
    /* текст записи в журнале */
    set text(text){ this._text = text; }
    get text(){ return this._text; }
    /* логин пользователя создавшего запись */
    set userName(userName){ this._userName = userName; }
    get userName(){ return this._userName; }
}