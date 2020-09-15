<template>
    <div class="claim-doc-form">
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-select 
                            v-model="form.typeId" 
                            :items="refsLists.docTypes" 
                            label="Тип документа"
                            hide-details="auto"
                            outlined                                
                        ></v-select> 
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-textarea
                            v-model="form.description"
                            rows="1"
                            outlined                                    
                            label="Примечание"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-text-field
                            label="ID"
                            v-model="form.user.info"
                            outlined                                    
                            hide-details="auto"                                                 
                            >
                                <template v-slot:append>
                                    <v-icon @click="flags.searchUserDialogVisible = true" small class="mt-1" color="secondary">search</v-icon>                                
                                </template>
                        </v-text-field>
                    </v-col>                    
                </v-row>
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-file-input v-model="form.file" label="Добавить файл" outlined dense></v-file-input>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-btn @click.prevent="saveDoc" rounded depressed color="primary">
                            Прикрепить                            
                        </v-btn>  
                    </v-col>
                </v-row>
            </v-container>
        </v-form>        

        <search-user 
            dialog-title="Поиск пользователя" 
            :show-dialog-flag="flags.searchUserDialogVisible" 
            v-on:close-dialog="flags.searchUserDialogVisible = false" 
            v-on:setdata="setUser">
        </search-user> 

        <v-snackbar
            v-model="notification.visible"
            :timeout="5000"
            :color="notification.color"
            :top="true"
            :right="true"
        >
        {{ notification.text }}
        </v-snackbar>     
    </div>
</template>
<script>
// TODO: После Примечания есть отступ под оишбки, у обычных полей он скрыт - нужно и этот скрыть
    'use strict'

    import { apiClaimDocsMixin } from '@/../mixins/apiClaimDocsMixin'    
    import { apiUserMixin } from '@/../mixins/apiUserMixin'    
    import { claimRefsMixin } from '@/../mixins/claimRefsMixin'

    import { editDoc } from '@/../entities/editDoc'
    import { ClaimDoc } from '@/../classes/ClaimDoc'

    import SearchUser from '@/../components/common/SearchUser'

    export default {
        name: 'ClaimDocForm',
        props: {
            clmId: Number,
            ownerId: Number,
            docId: Number,
            showDialogFlag: Boolean
        },
        /* следим */
        watch: {
            showDialogFlag: {
                immediate: true,
                deep: false,
                handler (val) {
                    if (!val) {
                        this.form.clear()
                    }

                    if (val) {
                        this.form.claimId = this.clmId
                        this.form.id = this.ownerId
                        
                        // типа возможно получить данные документа 
                        /*if (this.form.id) {
                            this.getDoc(this.form.id)
                        }*/
                        this.getCurrentUser()
                    }
                }
            }
        },  
        components: { SearchUser },
        directives: {},
        mixins: [ apiClaimDocsMixin, apiUserMixin, claimRefsMixin ],
        data () {            
            return {                
                flags: {
                    searchUserDialogVisible: false                
                },
                dialogs: {
                    filePreview: {
                        visible: false,
                        url: undefined
                    }
                },            
                filePreviewDisabled: false,
                fileDownloadDisabled: false,
                fileRemoveDisabled: false,
                /* пусть, куда загружается файл при добавлениие в форму */
                uploadLink: OMInsurance.host + OMInsurance.path + "/File/Upload",
                /* данные документа, полченные с сервера */
                doc: undefined,
                /* загруженный файл */
                files: undefined,
                /* форма */
                form: editDoc,

                notification: {
                    visible: false,
                    color: 'success',
                    text: undefined
                }
            }
        },
        methods: {
            /* возвращает в форму текущего пользователя */
            getCurrentUser () {
                let vm = this

                this.apiGetUserData(OMInsurance.login)
                    .then((response) => {     
                        if (response.result === "OK") {
                            // устанавливаем данные пользователя            
                            vm.form.setUser(response.data);
                        }
                        
                    })
            },
            /* Отправлка сообщений */  
            notif (text, color) {
                this.notification.text = text
                this.notification.color = color

                this.notification.visible = true
            },  
            setUser (data) {
                this.form.setUser(data)
            },
            setFile (file) {
                this.form.file = file
            },
            /* сохранение документа */            
            saveDoc () {    
                var vm = this
                
                if (this.form.file) {
                    let formData = new FormData()

                    formData.append("file", this.form.file, this.form.file.name)

                    this.apiPostClaimFileUpload(formData)
                        .then((response) => {
                           
                            if (response.answer === "OK") {                                                                                            
                                vm.sendForm()                  
                            } else {
                                // todo: перенести в общую систему сообщений
                                vm.notif('Файл не загрузился, невозможно сохранить документ', 'error')                                
                            }
                        })
                        .catch((response) => {
                            // todo сообщение об ошибке авторизации
                        })
                } else {
                    this.notif('Отсутствует файл, невозможно сохранить документ', 'error')
                }           
                
            },
            /* отправка формы */
            sendForm () {                
                                
                var model = this.form.getAspModel()                
                
                this.apiPostSetClaimDoc(model)
                    .then((response) => {
                        if (response.result === "Ok") {
                            //this.notif('Документ успешно сохранен', 'success')

                            this.$emit('setdata')

                            this.$emit('close-dialog')

                        } else if (response.result === "Error") {
                            // todo: перенести в общую систему сообщений
                            this.notif('Документ не был сохранен', 'error')
                        }
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");                        
                        }
                    })
            },
                        
        }        
    }
</script>