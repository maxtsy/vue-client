<template>      
    <v-card outlined class="claim-notes mt-6">
        <v-expansion-panels flat v-model="expansionPanels.notes">
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default>
                        <div class="v-expansion-panel-header__icon" style="margin-left: 0;"><i aria-hidden="true" class="v-icon notranslate material-icons theme--light" style="font-size:12px;color:#455A64;">keyboard_arrow_down</i></div>
                        <div style="color:#455A64;">ЗАМЕТКИ</div>
                    </template>
                    <template v-slot:actions>
                        <v-btn @click.native.stop="addNote" :disabled="disabled" text type="button" color="primary">
                            <v-icon size="16" color="primary">add_circle_outline</v-icon> Добавить
                        </v-btn>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-data-table
                        :headers="headers"
                        :items="notes"
                        hide-default-footer
                        class="claim-notes-results"
                    >
                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                small
                                @click.stop="removeNote(item)"
                            >
                                delete
                            </v-icon>                         
                        </template>
                    </v-data-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <claim-note-dialog
            :show-dialog-flag="flags.addClaimNoteDialogVisible"
            :clm-id="clmId"
            :note-id="selectedId"
            :dialog-title="claimNoteDialogTitle"
            @close-dialog="closeDialog"
            @setdata="afterCreateNote"></claim-note-dialog>
    </v-card>
</template>

<script>
    'use strict'

    import { apiClaimNotesMixin } from '@/../mixins/apiClaimNotesMixin'    
    import { ClaimNote } from '@/../classes/ClaimNote'
    import ClaimNoteDialog from '@/../components/claims/common/ClaimNoteDialog'
    
    export default {
        name: 'ClaimNotes',
        props: {
            clmId: Number,
            clmStateId: Number,
            showNoteDialog: Boolean
        }, 
        components: { ClaimNoteDialog },
        mixins: [ apiClaimNotesMixin ],
        /* следим */
        watch: {},
        
        data () {
            return {
                notes: [],
                expansionPanels: {
                    notes: 0
                },
                headers: [
                    { text: '#', sortable: false, value: 'id', width: 62 },
                    { text: 'Заметка', sortable: false, value: 'note' },                    
                    { text: 'Дата создания', value: 'fromDate', sortable: false },
                    /* { text: '', sortable: false, value: 'actions' }, */
                ],
                flags: {
                    /* флаг отображения окна создания/редактирования заметки */
                    addClaimNoteDialogVisible: false
                },
                
                /* заметка выбранная в таблице */
                selectedId: undefined,

                claimNoteDialogTitle: "Новая заметка",
            }
        },
        watch: {
            showNoteDialog (val) {
                if (val) {
                    this.addNote()
                }
            }
        },
        computed: {
            disabled () {
                return this.clmStateId === 21;
            }
        },
        methods: {            
            setNotes (notes) {   
                this.notes = [];

                for (let i = 0; i < notes.length; i++) {
                    const item = notes[i];
                    var note = new ClaimNote();
                    
                    note.id = item.Id;
                    note.claimId = item.ClaimId;
                    note.note = item.Note;
                    note.fromDate = item.Date;
                    note.userId = item.UserId;
                    note.dflDocId = item.DflDocId;
                    
                    this.notes.push(note);
                }
                
                this.$emit('set-notes-length', this.notes.length)
            },
            
            getNotes (claimId) {
                let vm = this

                this.apiGetClaimNotes(claimId)
                    .then((response) => {
                        if (response.result === "Ok") {                           
                            vm.setNotes(JSON.parse(response.data.notes))                       
                        } else {
                            // todo: сообщение об ошибке
                        }
                    })
                    .catch((response) => {
                        if (response.status === 401) {
                            alert("Перезагрузите страницу и авторизуйтесь заново!");
                        }
                    })
            },
            
            clear () {
                this.notes = []
                this.selectedId = undefined
            },

            /* методы кнопок */
            addNote () {
                this.flags.addClaimNoteDialogVisible = true
            },
            /** изменение заметки */
            editNote (item) {
                /** текущий id заметки */
                this.selectedId = item.id
                /** флаг открытия диалога */
                this.flags.addClaimNoteDialogVisible = true
            },
            /** удаление заметки */
            removeNote (item) {
                let vm = this

                if (confirm('Удалить заметку?')) {
                    this.apiPostRemoveClaimNote(item.id)
                        .then((response) => {
                            if (response.result === "Ok") {
                                vm.getNotes(vm.clmId)
                                // todo: сообщение: Заметка успешно удалена
                            } else {
                                // todo: сообщение: При удлении заметки произошла ошибка
                            }
                        })
                        .catch((response) => {
                            // todo: сообщение об авторизации
                        })
                }                
            },
            closeDialog () {
                this.flags.addClaimNoteDialogVisible = false

                this.$emit('close-note-dialog')
            },
            /** обновление списка после добавления заметки */
            afterCreateNote () {
                this.getNotes(this.clmId)
            },            
            
        },
        created () {            
            this.getNotes(this.clmId)
        },
    }
</script>