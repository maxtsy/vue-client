/* Класс лога претензии */
export class ClaimStatus {
    set id(id) { this._id = id; }
    get id() { return this._id; }
    set claimId(claimId) { this._claimId = claimId; }
    get claimId() { return this._claimId; }
    set stateId(stateId){ this._stateId = stateId; }
    get stateId(){ return this._stateId; }
    set stateName(stateName){ this._stateName = stateName; }
    get stateName(){ return this._stateName; }
    set stageId(stageId){ this._stageId = stageId; }
    get stageId(){ return this._stageId; }
    set stageName(stageName){ this._stageName = stageName; }
    get stageName(){ return this._stageName; }
    set stageDate(stageDate) {this._stageDate = stageDate; }
    get stageDate() { return this._stageDate; }
    set fromDate(fromDate) {this._fromDate = fromDate; }
    get fromDate() { return this._fromDate; }
    set userId(userId) {this._userId = userId; }
    get userId() { return this._userId; }
    set user(user) { this._user = user; }
    get user() { return this._user; }    
}