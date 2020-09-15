<template scoped>
    <div class="claim-note-form">
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-textarea
                            v-model="form.note"
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
                                    <v-icon @click="flags.searchUserDialogVisible = true" small color="secondary" class="mt-1">search</v-icon>                                
                                </template>
                        </v-text-field>
                    </v-col>                    
                </v-row>                
                <v-row>
                    <v-col cols="12" class="pl-0 pr-0">
                        <v-btn @click.prevent="saveNote" rounded depressed color="primary">
                            Закрыть                            
                        </v-btn>  
                    </v-col>
                </v-row>
            </v-container>
        </v-form>        

        <search-user 
            dialog-title="Поиск пользователя" 
            :show-dialog-flag="flags.searchUserDialogVisible" 
            v-on:close-dialog="flags.searchUserDialogVisible = false" 
            @setdata="setUser">
        </search-user>         
    </div>    
</template>

<script>
    'use strict'

    import { apiClaimNotesMixin } from '@/../mixins/apiClaimNotesMixin'        
    import { apiUserMixin } from '@/../mixins/apiUserMixin'        

    import { editNote } from '@/../entities/editNote'

    import SearchUser from '@/../components/common/SearchUser'

    export default {
        name: 'ClaimNoteForm',
        props: { 
            clmId: Number,
            noteId: Number,
            showDialogFlag: Boolean
        },    
        /* следим */
        watch: {
            /* закрытие формы */        
            showDialogFlag: {
                immediate: true,
                deep: false,
                handler(val) { 
                    if (!val) {
                        this.form.clear()
                    }
                    
                    if (val) {
                        this.form.id = this.noteId
                        this.form.claimId = this.clmId
                        
                        if (this.form.id)
                            this.getNote(this.form.id)

                        this.setCurrentUser()
                    }                                    
                }
            }
        },
        components: { SearchUser },
        mixins: [ apiUserMixin, apiClaimNotesMixin ],

        data: function() {            
            return {                
                form: editNote,
                flags: {
                    searchUserDialogVisible: false
                }                
            }
        },
        methods: {
            /* устанавливает выбранного пользователя в форму */
            setUser (data) {
                this.form.setUser(data)
            },
            /* устанавливает текущего пользователя в форму */
            setCurrentUser () {
                let vm = this

                this.apiGetUserData(OMInsurance.login)
                    .then((response) => {     
                        if (response.result === "OK") {
                            // устанавливаем данные пользователя            
                            vm.form.setUser(response.data);
                        }
                        
                    })
                    .catch((response) => {
                        // todo: сообщение об авторизации 401
                    })
            },                             
            
            /* AJAX */
            /**
             * Сохранение заметки
             */
            saveNote() {
                let model = this.form.getAspModel()                            
                
                this.apiPostSetClaimNote(model)
                    .then((response) => {
                        if (response.result === 'Ok') {
                            
                            this.$emit("setdata");
                            /* закрываем окно */
                            this.$emit('close-dialog'); 

                            // todo: сообщение Заметка успешно сохранена
                        } else {
                            // todo: сообщение Заметка не сохранена
                        }
                    })
                    .catch((response) => {
                        // todo: сообщение об авторизации
                    })                
            }, 
            /* Получение заметки */
            getNote (id) {
                this.apiGetClaimNote(id)
                    .then((response) => {
                        if (response.result === "Ok") {                                                                                  
                            this.form.set(response.note)
                        }
                    })
                    .catch((response) => {
                        // todo: сообщение об авторизации
                    })
            },            
        },
    }
</script>