import { apiUserMixin } from '@/../mixins/apiUserMixin'

export const agreeRefsMixin = {
    mixins: [apiUserMixin ],
    data() {
        return {
            refs: {
                agree: {
                    stages: [],
                    scenarios: [],
                    operators: [],
                    deliveryCenters: []
                }
            },
            refsLists: {
                agree: {
                    stages: [],
                    scenarios: [],
                    operators: [],
                    deliveryCenters: []
                }                
            }
        }
    },
    methods: {
        getAgrBaseRefs(regionId, companyId) {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/Api/AgrBaseRefs`, { params: { regionId, companyId } })
        },
        async apiGetAgrBaseRefs(regionId, companyId) {
            
            const { data } = await this.getAgrBaseRefs(regionId, companyId)

            this.refs.agree.stages = JSON.parse(data.stages)
            this.refs.agree.scenarios = JSON.parse(data.scenarios)
            this.refs.agree.operators = JSON.parse(data.operators)
            this.refs.agree.deliveryCenters = JSON.parse(data.deliveryCenters)
        }
    },
    created() {
        this.apiGetUserData(OMInsurance.login)
            .then((response) => {
                
                this.apiGetAgrBaseRefs(response.data.RegionId, response.data.CompanyId)
                    .then(() => {
                        this.refsLists.agree.stages = this.refs.agree.stages.map(function (item, index, array) {
                            return { text: item.Name, value: item.Id };
                        });
                        this.refsLists.agree.scenarios = this.refs.agree.scenarios.map(function (item, index, array) {
                            return { text: item.Name, value: item.Id };
                        });
                        this.refsLists.agree.operators = this.refs.agree.operators.map(function (item, index, array) {
                            return { text: item.Name, value: item.Id };
                        });
                        this.refsLists.agree.deliveryCenters = this.refs.agree.deliveryCenters.map(function (item, index, array) {
                            return { text: item.Name, value: item.Id };
                        });
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");
                        }
                    });
            })
            .catch((response) => { })        
    }
}