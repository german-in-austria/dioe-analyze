<template>
  <div class="hello pa-5">
    <div id="header">
      <img src="https://image.ibb.co/nLutoU/header.png" alt="dianalyze-header" height="75px"/>
    </div>
    <br>
    <form id="demo">
      <v-container fluid grid-list-lg>
      <v-layout align-start justify-start row fill-height wrap>
      <v-flex xs6>
        <v-autocomplete
          prepend-icon="cloud_circle"
          label="Erhebung"
          placeholder="Start typing to Search"
          @input="getSurvey"
          v-model="erhebung_key"
          :items="erhebungenAutocompleatable"
          v-on:change="loadAnswers(erhebung,aufgabenset,antworten)"
        />
      </v-flex>
      </v-layout>
      <v-layout align-start justify-start row fill-height wrap>
        <v-flex xs6>
          <v-autocomplete
            label="Aufgabenset"
            prepend-icon="filter_list"
            placeholder="Start typing to Search"
            v-model="aufgabenset"
            :items="aufgabensetsAutocompleatable"
            :disabled="this.aufgabenset===0"
            v-on:change="loadAnswers(erhebung,aufgabenset,antworten)"
          />
        </v-flex>
      </v-layout>
      <v-layout align-start justify-start row fill-height wrap>
        <v-flex xs5>
          <v-slider
            prepend-icon="unfold_more"
            v-model.number="antworten"
            label="Anzahl Antworten"
            thumb-color="green"
            min="0"
            :max="this.antworten_max"
            :disabled="this.complete"
            thumb-label="always" />
        </v-flex>
        <v-flex xs1>
          <v-text-field
            v-model.number="antworten"
            type="number"
            steps="1"
            min="0"
            :max="this.antworten_max"
            :disabled="this.complete" />
        </v-flex>
      </v-layout>
      <v-layout align-start justify-start row fill-height wrap>
        <v-flex xs6>
          <v-checkbox v-model="complete"
            v-on:change="setAnswerMax()"
            label="Alle Antworten"
          ></v-checkbox>
        </v-flex>
      </v-layout>
      <v-layout align-start justify-start row fill-height wrap>
        <v-radio-group v-model="sheetoption" label="Download Option:" row>
          <v-radio
            name="displayoption"
            label="Alle Tag-Informationen"
            color="red"
            :value="0"
            checked="true"
          ></v-radio>
          <v-radio
            name="displayoption"
            label="Nur Tagkürzel"
            color="blue"
            :value="1"
          ></v-radio>
          <v-radio
            name="displayoption"
            label="Hierarchische Abbildung"
            color="green"
            :disabled="true"
            :value="2"
          ></v-radio>
        </v-radio-group>
      </v-layout>
      <v-layout align-start justify-start row fill-height wrap>
        <v-label v-if="this.table_filled">Query-Vorschau</v-label>
      </v-layout>
      <v-layout align-start justify-start row fill-height wrap>
        <v-flex xs12>
          <v-data-table v-if="this.table_filled"
            :headers="headers"
            :items="tableanswers"
            class="elevation-1"
            >
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.calories }}</td>
              <td class="text-xs-right">{{ props.item.fat }}</td>
              <td class="text-xs-right">{{ props.item.carbs }}</td>
              <td class="text-xs-right">{{ props.item.protein }}</td>
              <td class="text-xs-right">{{ props.item.iron }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
      <v-btn v-on:click="loadAnswers(erhebung,aufgabenset,antworten)">
        <v-icon left dark>refresh</v-icon>ERZEUGE QUERY
      </v-btn>
      <v-btn v-on:click="downloadXLSX" :disabled="this.antworten===0">
        <v-icon left dark>attach_file</v-icon>EXPORTIERE XLSX
      </v-btn>
      <v-btn v-on:click="clear" :disabled="false">
        <v-icon left dark>settings_backup_restore</v-icon>RESET
      </v-btn>
    </v-container>
    </form>
    <hr />
    <b>Erhebung:</b> {{ erhebung }} &nbsp <b>Aufgabenset:</b> {{ aufgabenset }} &nbsp <b>Anzahl Antworten:</b> {{ antworten }}<br>
    <b>Radio Option: {{ sheetoption }} </b><br>
    <b>API-Link:</b> https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&tagname=true&start=0&len=<font color="red">{{ antworten }}</font>&ampfilter=erhebung:<font color="red">{{ erhebung }}</font>,aufgabenset:<font color="red">{{ aufgabenset }}</font><br>
    <h3><i><br>A few notes [2018-06-10]:<ul><li>Query preview will be shown after clicking "Generate Query". As of right now just dummy column values, a fix is to be expected soon ;-)</li><li>XLSX export now active and working (some columns will be edited, especially tagsets)</li><li>third download options (hierarchy) will follow within the next days, some bugs need to be fixed</li><li>all components are now vuetify components. everything is 100% responsive, read more here: <a href="https://vuetifyjs.com" target="_blank">vuetifyjs.com</a></li></ul></i></h3>
    <h3><br>Git Repository: <a href="https://github.com/german-in-austria/dioe-analyze/tree/master/dianalyze" target="_blank">https://github.com/german-in-austria/dioe-analyze/tree/master/dianalyze</a></h3>
  </div>
</template>
<script>
var XLSX = require('xlsx')
var _ = require('lodash')
var filesaver = require('filesaver.js-npm')
var wb = XLSX.utils.book_new()

wb.items = {
  Title: "EH" + this.erhebung + "_AS" + this.aufgabenset + "_AW" + this.antworten + "_" + Date.now(),
  Subject: "DiÖ",
  Author: "DiÖ"
}

export default {
  name: 'DIANA',
  async mounted () {
    var erhjson = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?info=filter`)
    this.erhebungen.filter = (await erhjson.json()).filter
  },
  computed: {
    erhebungenAutocompleatable () {
      if (this.erhebungen.filter[0]) {
        return this.erhebungen.filter[0].map((v, i) => ({ text: v.Bezeichnung_Erhebung, value: i }))
      } else {
        return []
      }
    },
    aufgabensetsAutocompleatable () {
      if (this.erhebungen.filter[0]) {
        return this.erhebungen.filter[0][this.erhebung_key].Aufgabensets.map((v, i) => ({ text: v.Kuerzel + " | " + v.Name_Aset, value: v.pk }))
      } else {
        return []
      }
    }
  },
  methods : {
    async loadAnswers (erh, set, length) {
      // this.antworten_max = 0
      this.antwortenTable = []
      // this.awRows = []
      console.log("awTable: ", this.antwortenTable)
      this.erhebung = erh
      this.aufgabenset = set
      var result = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&tagname=true&start=0&len=${this.antworten}&filter=erhebung:${this.erhebung},aufgabenset:${this.aufgabenset}`)
      var resultEmpty = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&tagname=true&start=0&len=0&filter=erhebung:${this.erhebung},aufgabenset:${this.aufgabenset}`)
      console.log("loadAnswers Params:", this.erhebung, this.aufgabenset, this.antworten)
      this.awjson.tbl_antworten = (await result.json()).tbl_antworten
      this.antworten_max = (await resultEmpty.json()).tbl_antworten_count.all
      var tagcount = 0
      var i
      var j
      var jObject = {}
      var tagKey = ""
      var satzKey = ""
      var tagString = ""
      // var headersobj = {}
      var headerstmp = []
      // var answerstmp = []

      if (this.sheetoption === 0) { // ALLE TAGINFOS IN EINZELSPALTEN
        for (i = 0; i < length; i++) {
          tagcount = this.awjson.tbl_antworten[i].tbl_antwortentags_set.length
          _.forEach(this.awjson.tbl_antworten[i], function (value, key) {
            if (i === 0) {
              // headerstmp.push(key)
              var headersobj = {}
              headersobj.text = _.clone(key)
              headersobj.value = _.clone(key)
              headerstmp.push(headersobj)
              // console.log("headerobj", headersobj)
            }

            if (key === "ist_Satz") {
              _.forEach(value, function (v, k) {
                // console.log("header key: " + key + " | inner key: " + k + " | val: " + v)
                satzKey = key + " " + k
                jObject[satzKey] = v
              })
            } else if (key === "tbl_antwortentags_set") {
              for (j = 0; j < tagcount; j++) {
                _.forEach(value[j], function (v, k) {
                  // console.log("header key: " + key + " | inner key: " + k + " | val: " + v)
                  tagKey = "Tag_" + (j + 1) + "_" + key + " " + k
                  jObject[tagKey] = _.clone(v)
                })
              }
            } else {
              // console.log("header key: " + key + " | value: " + value)
              jObject[key] = value
            }
          })
          // console.log("hobj i: " + i + " " + headersobj.text)
          // every object that has been generated by the parsing process, gets written into an array which has the correct structure for the excel export
          this.antwortenTable[i] = _.clone(jObject)
          this.headers = _.clone(headerstmp)
          // console.log("headers:", this.headers)
        }
      } else if (this.sheetoption === 1) { // TAGKÜRZEL
        console.log("Download-Option: Tagkürzel")
        tagKey = "Tags"

        for (i = 0; i < length; i++) {
          tagcount = this.awjson.tbl_antworten[i].tbl_antwortentags_set.length
          _.forEach(this.awjson.tbl_antworten[i], function (value, key) {
            if (key === "ist_Satz") {
              _.forEach(value, function (v, k) {
                satzKey = key + " " + k
                jObject[satzKey] = v
              })
            } else if (key === "tbl_antwortentags_set") {
              for (j = 0; j < tagcount; j++) {
                _.forEach(value[j], function (v, k) {
                  // tagKey = "Tag_" + (j + 1) + "_" + key + " " + k
                  // jObject[tagKey] = _.clone(v)
                  if (k === "id_Tag_Name") {
                    console.log("Tagname: ", v)
                    tagString += _.clone(v) + " "
                  }
                })
                jObject["Tags"] = tagString
              }
            } else {
              // console.log("header key: " + key + " | value: " + value)
              jObject[key] = value
            }
          })
          // every object that has been generated by the parsing process, gets written into an array which has the correct structure for the excel export
          this.antwortenTable[i] = _.clone(jObject)
          this.tableanswers[i] = _.clone(jObject)
          console.log("String: ", tagString)
        }
      } else {
        // HIERARCHISCHE ABBILDUNG
        console.log("coming soon!")
      }
      // this.antworten_max = this.awjson.tbl_antworten_count.all
      if (this.antwortenTable.length > 0) {
        console.log("FILLED!")
        this.table_filled = true
      }
      if (this.complete) { this.antworten = this.antworten_max }
      console.log("length", this.antwortenTable.length)
      console.log("tableanswers", this.tableanswers)
    },
    clear () {
      this.complete = false
      this.sheetoption = 0
      this.erhebung = 0
      this.erhebung_key = 0
      this.aufgabenset = 0
      this.antworten = 0
      // this.awjson = {}
      this.antworten_max = 0
      this.table_filled = false
    },
    s2ab (s) {
      var buf = new ArrayBuffer(s.length) // convert s to arrayBuffer
      var view = new Uint8Array(buf)  // create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF // convert to octet
      return buf
    },
    setAnswerMax () {
      console.log("setAnswerMax")
      this.antworten = this.antworten_max
    },
    downloadXLSX () {
      var wsname = "EH" + this.erhebung + "_AS" + this.aufgabenset + "_AW" + this.antworten + "_" + Date.now()
      console.log(wsname)
      var ws = XLSX.utils.json_to_sheet(this.antwortenTable)
      XLSX.utils.book_append_sheet(wb, ws, wsname)
      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'})
      filesaver.saveAs(new Blob([this.s2ab(wbout)], {type:"application/octet-stream"}), 'DIANA_EH' + this.erhebung + '_AS' + this.aufgabenset + '_AW' + this.antworten + '.xlsx')
    },
    async getSurvey () {
      this.aufgabenset = 0
      if (this.erhebung_key !== 0) {
        this.erhebung = this.erhebungen.filter[0][this.erhebung_key].pk
        if (this.erhebungen.filter[0][this.erhebung_key].Aufgabensets[0].pk) {
          if (this.erhebung_key !== 0) {
            this.aufgabenset = this.erhebungen.filter[0][this.erhebung_key].Aufgabensets[0].pk
          }
        }
      }
      var jsonres = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&tagname=true&start=0&len=${this.antworten}&filter=erhebung:${this.erhebung},aufgabenset:${this.aufgabenset}`)
      // console.log(jsonres)
      // console.log(jsonres.tbl_antworten[0])
      this.awjson.tbl_antworten_count = (await jsonres.json()).tbl_antworten_count
      console.log("MAX: ", this.awjson.tbl_antworten_count.all)
      this.antworten_max = this.awjson.tbl_antworten_count.all
    },
    async geterh () {
      var erhjson = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?info=filter`)
      this.erhebungen.filter = (await erhjson.json()).filter
    }
  },
  data () {
    return {
      awjson : {
        tbl_antworten_count: {},
        tbl_antworten: []
      },
      antwortenTable: [],
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' }
      ], // for v-data-table
      tableanswers: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%'
        }
      ], // for v-data-table
      erhebungen : { filter: [] },
      erhebung : 0,
      aufgabenset : 0,
      antworten : 0,
      antworten_max : 0,
      erhebung_key : 0,
      complete : false,
      table_filled : false,
      sheetoption : 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
.hello {
  background-color: white !important;
}
a {
  color: #42b983;
}
input {
  border: 2px solid #ddd;
}
label {
  width: 10em;
  display: block;
  float: left;
  margin-left: 10px;
}
button {
  border: 2px solid #ddd;
  /*background-color: #c2c6c9 !important;*/
  padding: 5px 5px 5px 5px;
  color: #3b4d5a;
  margin-left: 10px;
}
select {
  width: 30%;
  border: 2px solid #ddd;
  white-space: normal;
  max-height: 26px;
}
hr {
  margin-top: 10px;
  margin-botton: 10px;
}
option {
  width: 100%;
  border-collapse: collapse;
}
.normal {
  max-width: 100%;
  overflow: hidden;
  white-space: normal;
}
</style>
<style>
.slider {
  /* overwrite slider styles */
  width: 200px;
}
</style>
