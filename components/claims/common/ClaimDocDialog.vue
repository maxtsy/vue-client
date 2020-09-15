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
                <claim-doc-form 
                    :show-dialog-flag="showDialogFlag" 
                    :clm-id="clmId"
                    :owner-id="ownerId"                       
                    @close-dialog="afterClose"
                    @setdata="afterCreateDoc"></claim-doc-form>                
            </v-card-text>
        </v-card>
    </v-dialog>    
</template>
<script>
    'use strict'
    
    import ClaimDocForm from './ClaimDocForm'

    export default {
        name: 'ClaimDocDialog',
        components: { ClaimDocForm },
        props: {
            clmId: Number,
            ownerId: Number,
            dialogTitle: String,
            showDialogFlag: Boolean
        },
        methods: {
            /* закрытие окна */
            afterClose () {            
                this.$emit('close-dialog')
            },
            afterCreateDoc (data) {
                this.$emit("setdata", data)
            }
        }
    }
</script>