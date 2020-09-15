export const claimRefsMixin = {
    data() {
        return {
            refs: {
                eventForms: [],
                claimTypes: [],
                claimReciptTypes: [],
                claimReasons: [],
                claimSolvencies: [],
                claimStates: [],
                claimStages: [],
                memberTypes: [], 
                docTypes: []
            },
            refsLists: {
                eventForms: [],
                claimTypes: [],
                claimReciptTypes: [],
                claimReasons: [],
                claimSolvencies: [],
                claimStates: [],
                claimStages: [],
                memberTypes: [],
                docTypes: []
            }
        }
    },
    methods: {
        filterClaimReasons(claimTypes, claimReasons) {
            let claimReasonsTypes = claimTypes.map(function(item) { return { name: item.Name, id: item.Id, children: [] } })

            for (let i = 0; i < claimReasonsTypes.length; i++) {
                const typeId = claimReasonsTypes[i]['id'];

                let claimReasonsByType = claimReasons.filter(function (item) { return item.TypeId == typeId && item.ParentId == null })
                let claimReasonsByTypeChildren = claimReasons.filter(function (item) { return item.TypeId == typeId && item.ParentId !== null })

                claimReasonsTypes[i]['children'] = claimReasonsByType.map(function(item) {
                    const claimReasonItem = { id: item.Id, name: item.Name }
                    let children = claimReasonsByTypeChildren.filter(function (item) { return item.ParentId == claimReasonItem.id })

                    if (children.length > 0) {
                        
                        children = children.map(function(item) { return { id: item.Id, name: item.Name } })

                        claimReasonItem['children'] = children 
                    }

                    return claimReasonItem
                })
            }

            return claimReasonsTypes            
        },        
        /**
         * Возвращает справочники обращений
         */
        getClaimRefs() {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/Api/ClaimsRefs`, {})
        }, 
        /**
         * Возвращает справочники для претензий
         */
        async apiGetClaimRefs() {
            const { data } = await this.getClaimRefs()

            this.refs.eventForms = JSON.parse(data.events)
            this.refs.claimTypes = JSON.parse(data.types)
            this.refs.claimReasons = JSON.parse(data.reasons)
            this.refs.claimReciptTypes = JSON.parse(data.reciptTypes)
            this.refs.claimStates = JSON.parse(data.states)
            this.refs.claimStages = JSON.parse(data.stages)
            this.refs.claimSolvencies = JSON.parse(data.solvencies)
            this.refs.memberTypes = JSON.parse(data.members)
            this.refs.docTypes = JSON.parse(data.docTypes)            
        },
    },
    created () {
        const vm = this
        this.apiGetClaimRefs()
            .then(() => { 
                this.refsLists.eventForms = this.refs.eventForms.map(function(item) { return { text: item.Name, value: item.Id } })
                this.refsLists.claimTypes = this.refs.claimTypes.map(function(item) { return { text: item.Name, value: item.Id } })
                this.refsLists.claimReasons = vm.filterClaimReasons(vm.refs.claimTypes, vm.refs.claimReasons)
                this.refsLists.claimReciptTypes = this.refs.claimReciptTypes.map(function(item) { return { text: item.Name, value: item.Id } })
                this.refsLists.claimStates = this.refs.claimStates.map(function(item) { return { text: item.Name, value: item.Id } })
                this.refsLists.claimStages = this.refs.claimStages.map(function(item) { return { text: item.Name, value: item.Id } })
                this.refsLists.claimSolvencies = this.refs.claimSolvencies.map(function(item) { return { text: item.Name, value: item.Id } })
                this.refsLists.memberTypes = this.refs.memberTypes.map(function(item) { return { text: item.Name, value: item.Id } })
                this.refsLists.docTypes = this.refs.docTypes.map(function(item) { return { text: item.Name, value: item.Id } })
            })
            .catch((response) => {
                if (response.status === 401) {
                    alert("Перезагрузите страницу и авторизуйтесь заново!");
                }
            });
    }
}