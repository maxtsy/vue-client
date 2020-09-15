export const baseRefsMixin = {
    data () {
        return {
            refs: {
                regions: [],
                companies: [],                
            },
            refsLists: {
                regions: [],
                companies: [],
                activities: [
                    { text: 'Да', value: -1 },
                    { text: 'Нет', value: 0 },
                    { text: 'Не важно', value: 1 },
                ]
            }
        }
    },
    methods: {
        /**
         * Возвращает справочники Регионов и Компаний
         */
        getBaseRefs() {
            return this.$http.get(`${OMInsurance.host}${OMInsurance.path}/Api/BaseRefs`, {})
        },
        /**
         * Возвращает справочники регионы и компании
         */
        async apiGetBaseRefs () {
            const { data } = await this.getBaseRefs();

            this.refs.regions = JSON.parse(data.regions);
            this.refs.companies = JSON.parse(data.companies);                                                 
        }, 
    },
    created() {        
        this.apiGetBaseRefs()
            .then(() => {
                this.refsLists.regions = this.refs.regions.map(function(item, index, array) {
                    return { text: item.Name, value: item.Id };
                });           
                this.refsLists.companies = this.refs.companies.map(function(item, index, array) {
                    return { text: item.Name, value: item.Id };
                }); 
            })
            .catch((response) => {
                if (response.status === 401) {
                    alert("Перезагрузите страницу и авторизуйтесь заново!");
                }
            });   
    }
}