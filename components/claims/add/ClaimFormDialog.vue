<template>
    <v-dialog 
        v-model="showDialogFlag" 
        persistent 
        max-width="1280px">
        <v-card>
            <v-card-title>
                <span class="subtitle-2" style="font-size: 1rem !important;">Новое обращение</span>   
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon @click="afterClose">close</v-icon>          
                </v-btn>
            </v-card-title>            
            <v-card-text>
                <claim-form></claim-form>               
            </v-card-text>
        </v-card>
    </v-dialog>     
</template>
<script>
    'use strict'
    export default {
        
    }
</script>