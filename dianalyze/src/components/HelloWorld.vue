<template>
  <div class="hello pa-5">
    <div id="header">
      <img src="https://image.ibb.co/nLutoU/header.png" alt="dianalyze-header" height="75px"/>
    </div>
    <br>
    <form id="demo">
      <p>
        <v-autocomplete
          prepend-icon="cloud_circle"
          label="Erhebung"
          placeholder="Start typing to Search"
          @input="getSurvey"
          v-model="erhebung_key"
          :items="erhebungenAutocompleatable"
        />
      </p>
      <p>
        <v-layout>
          <v-flex>
            <!--<label v-if="(this.aufgabenset > 0)" for="aufgabenset">Aufgabenset:&nbsp</label>-->
          </v-flex>
        </v-layout>
        <v-autocomplete
          label="Aufgabenset"
          prepend-icon="filter_list"
          placeholder="Start typing to Search"
          v-model="aufgabenset"
          :items="aufgabensetsAutocompleatable"
          :disabled="this.aufgabenset===0"
        />
      </p>
      <p>
        <v-text-field
          prepend-icon="unfold_more"
          label="Anzahl Antworten"
          v-model.number="antworten"
          type="number"
          steps="1"
          min="0"
          max="200" />
      </p>
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
          label="Hierarchische Abbildung (coming soon)"
          color="green"
          disabled="true"
          :value="2"
        ></v-radio>
      </v-radio-group>
      <v-btn v-on:click="loadAnswers(erhebung,aufgabenset,antworten)"><v-icon left dark>refresh</v-icon>Erzeuge Query</v-btn>
      <!--<v-btn v-if="Object.keys(this.awjson.tbl_antworten).length>0" v-on:click="downloadXLSX">EXPORT XLSX</v-btn>-->
      <!--<v-btn disabled="Object.keys(this.awjson.tbl_antworten).length>0" v-on:click="downloadXLSX"><v-icon left dark>attach_file</v-icon>EXPORT XLSX</v-btn>-->
      <v-btn v-on:click="downloadXLSX" :disabled="Object.keys(this.awjson.tbl_antworten).length===0"><v-icon left dark>attach_file</v-icon>EXPORT XLSX</v-btn>
    </form>
    <hr />
    <b>Erhebung:</b> {{ erhebung }} &nbsp <b>Aufgabenset:</b> {{ aufgabenset }} &nbsp <b>Anzahl Antworten:</b> {{ antworten }}<br>
    <b>Radio Option: {{ sheetoption }} </b><br>
    <b>API-Link:</b> https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&tagname=true&start=0&len=<font color="red">{{ antworten }}</font>&ampfilter=erhebung:<font color="red">{{ erhebung }}</font>,aufgabenset:<font color="red">{{ aufgabenset }}</font><br>
    <h3><i><br>A few notes [2018-03-16]:<ul><li>XLSX export now active and working (some columns will be edited, especially tagsets)</li><li>third download options (hierarchy) will follow within the next days, some bugs need to be fixed</li><li>all components are now vuetify components. everything is 100% responsive, read more here: <a href="https://vuetifyjs.com" target="_blank">vuetifyjs.com</a></li></ul></i></h3>
    <h3><br>Git Repository: <a href="https://github.com/german-in-austria/dioe-analyze/tree/master/dianalyze" target="_blank">https://github.com/german-in-austria/dioe-analyze/tree/master/dianalyze</a></h3>
  </div>
</template>
<script>
var XLSX = require('xlsx')
var _ = require('lodash')
var filesaver = require('filesaver.js-npm')
var wb = XLSX.utils.book_new()

wb.Props = {
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
      this.erhebung = erh
      this.aufgabenset = set
      this.antworten = length
      var result = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&tagname=true&start=0&len=${this.antworten}&filter=erhebung:${this.erhebung},aufgabenset:${this.aufgabenset}`)
      console.log("Params:", this.erhebung, this.aufgabenset, this.antworten)
      this.awjson.tbl_antworten = (await result.json()).tbl_antworten
      var tagcount = 0
      var i
      var j
      var jObject = {}
      var tagKey = ""
      var satzKey = ""
      var tagString = ""

      if (this.sheetoption === 0) {
        for (i = 0; i < length; i++) {
          tagcount = this.awjson.tbl_antworten[i].tbl_antwortentags_set.length
          _.forEach(this.awjson.tbl_antworten[i], function (value, key) {
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
          // every object that has been generated by the parsing process, gets written into an array which has the correct structure for the excel export
          this.antwortenTable[i] = _.clone(jObject)
        }
      } else if (this.sheetoption === 1) {
        tagKey = "Tags"
        // TAGKÜRZEL
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
          console.log("String: ", tagString)
        }
      } else {
        // HIERARCHISCHE ABBILDUNG
        console.log("coming soon!")
      }
    },
    clear () {
      this.sheetoption = 0
      this.erhebung = 0
      this.aufgabenset = []
      this.antworten = 0
      this.awjson = {}
    },

    s2ab (s) {
      var buf = new ArrayBuffer(s.length) // convert s to arrayBuffer
      var view = new Uint8Array(buf)  // create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF // convert to octet
      return buf
    },
    downloadXLSX () {
      var wsname = "EH" + this.erhebung + "_AS" + this.aufgabenset + "_AW" + this.antworten + "_" + Date.now()
      console.log(wsname)
      var ws = XLSX.utils.json_to_sheet(this.antwortenTable)
      XLSX.utils.book_append_sheet(wb, ws, wsname)
      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'})
      filesaver.saveAs(new Blob([this.s2ab(wbout)], {type:"application/octet-stream"}), 'DIANA_EH' + this.erhebung + '_AS' + this.aufgabenset + '_AW' + this.antworten + '.xlsx')
    },
    getSurvey () {
      this.aufgabenset = 0
      this.erhebung = this.erhebungen.filter[0][this.erhebung_key].pk

      if (this.erhebungen.filter[0][this.erhebung_key].Aufgabensets[0].pk) {
        this.aufgabenset = this.erhebungen.filter[0][this.erhebung_key].Aufgabensets[0].pk
      }
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
      erhebungen : { filter: [] },
      erhebung : 0,
      aufgabenset : 0,
      antworten : 0,
      erhebung_key : 0,
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
