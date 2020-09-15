<template>
    <v-card outlined class="claim-docs mt-6">
        <v-expansion-panels flat v-model="expansionPanels.docs">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div style="color:#455A64;">ДОКУМЕНТЫ И ФАЙЛЫ</div>
                    </template>
                    <template v-slot:actions>
                        <v-btn @click.native.stop="addDoc" :disabled="disabled" text type="button" color="primary">
                            <v-icon size="16" color="primary">add_circle_outline</v-icon> Добавить
                        </v-btn>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="headers"
                        :items="docs"
                        hide-default-footer
                        class="claim-docs-results"
                    >
                        <template v-slot:item.ext="{ item }">
                            <div v-if="item.ext == 'mp3'">
                                <audio controls>
                                    <source v-bind:src="item.src" type="audio/mp3" />
                                    Ваш браузер не поддерживает тэг audio!
                                </audio>  
                            </div> 
                            <div v-else-if="item.ext == 'jpg'">
                                <img
                                    style="width: 40px; height: 40px"
                                    :src="item.src"/>
                            </div>
                            <div v-else>                            
                                <a v-bind:href="item.src" target="_blank">{{item.name}}.{{item.ext}}</a>
                            </div>                             
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                small
                                @click.stop="removeDoc(item)"
                            >
                                delete
                            </v-icon>                         
                        </template>
                    </v-data-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <claim-doc-dialog
            :show-dialog-flag="flags.addClaimDocDialogVisible"
            :clm-id="clmId"
            :owner-id="selectedId"
            :dialog-title="claimDocDialogTitle"
            @close-dialog="closeDialog"
            @setdata="afterCreateDoc"></claim-doc-dialog>
    </v-card>    
</template>

<script>
// todo: отсутствие claimId в ф-и getDocs должно давать сообщение пользователю или пусть умирает тихо?
    'use strict'

    import { apiClaimDocsMixin } from '@/../mixins/apiClaimDocsMixin'
    
    import { ClaimDoc } from '@/../classes/ClaimDoc'

    import ClaimDocDialog from '@/../components/claims/common/ClaimDocDialog'

    export default {
        name: 'ClaimDocs',
        components: { ClaimDocDialog },
        mixins: [ apiClaimDocsMixin ],
        directives: {},
        props: {
            clmId: Number,
            clmStateId: Number,
            showDocDialog: Boolean
        },
        watch: {},
        data () {
            return {
                docs: [],
                expansionPanels: {
                    docs: 0
                },
                headers: [
                    { text: '#', sortable: false, value: 'id', width: 62 },
                    { text: 'Документ', sortable: false, value: 'ext' },                    
                    { text: 'Дата создания', sortable: false, value: 'fromDate' },
                    /* { text: '', sortable: false, value: 'actions' }, */
                ],

                claimDocDialogTitle: "Новый документ",
                flags: {
                    addClaimDocDialogVisible: false
                },
                
                selectedId: undefined
            }
        },
        watch: {
            showDocDialog (val) {
                if (val) {
                    this.addDoc()
                }
            }
        },
        computed: {
            disabled () {
                return this.clmStateId === 21;
            },
            dialogTitle () {
                return this.claimDocDialogTitle;
            }
        },
        methods: {
            setDocs (docs) {
                this.docs = [];
                
                for (let i = 0; i < docs.length; i++) {
                    const item = docs[i];
                    var doc = new ClaimDoc();
                                                            
                    doc.id = item.File.Id;
                    doc.docId = item.DocId;
                    doc.ownerId = item.Id;
                    doc.active = item.Active;
                    doc.fromDate = item.CreateDate;
                    doc.name = item.File.Name;
                    doc.ext = item.File.Ext.toLowerCase();
                    doc.description = item.File.Description;
                    doc.src = OMInsurance.host + OMInsurance.path + "/File/FileById?filename=" + doc.id;
                    doc.userId = item.User.Id;
                    doc.userLogin = item.User.Login;
                    doc.userFullName = item.User.Fullname;

                    this.docs.push(doc);
                }       
                
                this.$emit('set-docs-legth', this.docs.length)
            },            
            /* возвращет все документы */
            getDocs (claimId) {
                let vm = this
                
                this.apiGetClaimDocs(claimId)
                    .then((response) => {
                        if (response.result === "Ok") {
                            vm.setDocs(JSON.parse(response.data.docs))                       
                        } else {
                            // todo сообщение об ошибке
                        }
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");
                        }
                    })
            },
            clear () {
                this.docs = [];
                this.selectedId = undefined;
            },
            
            /* открывает диалоговое окно создания документа */
            addDoc () { 
                this.claimDocDialogTitle = "Добавление документа";
                this.selectedId = undefined;
                this.flags.addClaimDocDialogVisible = true;
            },
            editDoc (item) {
                this.claimDocDialogTitle = "Редактирование документа № " + item.id
                this.selectedId = item.ownerId;

                this.flags.addClaimDocDialogVisible = true;
            },
            removeDoc (item) {
                let vm = this

                if (confirm('Удалить документ?')) {
                    this.apiRemoveClaimDoc(item.ownerId)
                        .then((response) => {
                            if (response.result === 'Ok') {
                                vm.getDocs(vm.clmId)
                            } else {
                                // тут должно быть сообщение
                            }
                        })
                        .catch((response) => {

                        })
                }                
            },
            closeDialog () {
                this.flags.addClaimDocDialogVisible = false
                this.$emit('close-doc-dialog')
            },
            /** обновление списка после добавления документа */
            afterCreateDoc () {                                     
                this.getDocs(this.clmId) 

                this.flags.addClaimDocDialogVisible = false
            },
            
        },
        created () {
            this.getDocs(this.clmId)
        },
    }
</script>