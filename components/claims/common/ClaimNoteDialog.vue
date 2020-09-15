<template>
    <v-dialog 
        v-model="showDialogFlag" 
        persistent 
        max-width="600px">
        <v-card>
            <v-card-title>
                <span class="subtitle-2" style="font-size: 1rem !important;">{{dialogTitle}}</span>   
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon @click="afterClose">close</v-icon>          
                </v-btn>
            </v-card-title>            
            <v-card-text>
                <claim-note-form 
                    :show-dialog-flag="showDialogFlag" 
                    :clm-id="clmId"
                    :note-id="noteId"                       
                    @close-dialog="afterClose"
                    @setdata="afterCreateNote"></claim-note-form>                
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>
    'use strict'
    /* форма создания претензии */
    import ClaimNoteForm from './ClaimNoteForm'

    export default {
        name: 'claimNoteDialog',
        components: { ClaimNoteForm },
        props: {
            clmId: Number,
            noteId: Number,
            dialogTitle: String,
            showDialogFlag: Boolean
        },        
        methods: {
            /* закрытие окна */
            afterClose: function () {
                this.$emit('close-dialog');
            },

            afterCreateNote (data) {
                this.$emit('setdata', data)
            }
        }
    }
</script>