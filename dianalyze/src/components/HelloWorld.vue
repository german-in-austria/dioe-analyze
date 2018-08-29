<template>
  <div class="hello">
    <div id="header">
      <img src="https://image.ibb.co/nLutoU/header.png" alt="dianalyze-header" height="75px"/>
    </div>
    <!--<h1>DI(ö)ANA(lyze) - alpha</h1>-->
    <br>
    <form id="demo">
      <p>
        <label for="erhebung">Erhebung:&nbsp</label>
        <select v-model="erhebung_key">
          <option v-on:click="getSurvey" v-for="(eh, i) in erhebungen.filter[0]" :value="i">
            {{ eh.Bezeichnung_Erhebung }}
          </option>
        </select>
      </p>
      <p>
        <label v-if="(this.aufgabenset > 0)" for="aufgabenset">Aufgabenset:&nbsp</label>
        <select v-if="(this.aufgabenset > 0)" v-model="aufgabenset">
          <option v-for="option in erhebungen.filter[0][erhebung_key].Aufgabensets" :value="option.pk">
            {{ option.Name_Aset }}
          </option>
        </select>
      </p>
      <p>
        <label for="antworten">Anzahl Antworten:&nbsp</label>
        <input v-model.number="antworten" type="number" min="0" max="200">
      </p>
      <v-btn v-on:click="loadAnswers(erhebung,aufgabenset,antworten)">GENERATE JSON</v-btn>
      <v-btn v-if="Object.keys(this.awjson.tbl_antworten).length>0" v-on:click="exportCSV">EXPORT CSV</v-btn>
      <!--<v-btn v-on:click="geterh">Testbutton</v-btn>-->
    </form>
    <hr />
    <b>Erhebung:</b> {{ erhebung }} &nbsp <b>Aufgabenset:</b> {{ aufgabenset }} &nbsp <b>Anzahl Antworten:</b> {{ antworten }}<br>
    <b>API-Link:</b> https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&start=0&len=<font color="red">{{ antworten }}</font>&ampfilter=erhebung:<font color="red">{{ erhebung }}</font>,aufgabenset:<font color="red">{{ aufgabenset }}</font><br>
    <h3><i>JSON currently saved to logs, CSV export and table view coming soon.</i></h3>
  </div>
</template>
<script>
var _ = require('lodash')
var converter = require('json-2-csv')

var json2csvCallback = function (err, csv) {
  if (err) throw err
  console.log(csv)
  var encodedUri = encodeURI(csv)
  window.open(encodedUri)
}

export default {
  name: 'HelloWorld',
  async mounted () {
    var erhjson = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?info=filter`)
    this.erhebungen.filter = (await erhjson.json()).filter
  },
  methods : {
    async loadAnswers (erh, set, length) {
      this.erhebung = erh
      this.aufgabenset = set
      this.antworten = length
      var result = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&start=0&len=${this.antworten}&filter=erhebung:${this.erhebung},aufgabenset:${this.aufgabenset}`)
      console.log("Params:", this.erhebung, this.aufgabenset, this.antworten)
      // this.awjson = await result.json()
      // console.log("JSON:", await result.json())
      this.awjson.tbl_antworten = (await result.json()).tbl_antworten
      // console.log("tagset length: ", this.awjson.tbl_antworten[0].tbl_antwortentags_set.length)
      var header = ""
      var column = ""
      // var tags = ""
      var tagcount = 0
      var antworten = []
      var i
      var j
      for (i = 0; i < length; i++) {
        column = ""
        tagcount = this.awjson.tbl_antworten[i].tbl_antwortentags_set.length
        _.forEach(this.awjson.tbl_antworten[i], function (value, key) {
          if (i === 0) {
            // no comma at the end of the last header element
            if (key === "bfl_durch_S") {
              header = header + key + "\n"
              column = column + value + "\n"
            } else {
              // special treatment for nested obects like tags
              if (key === "tbl_antwortentags_set") {
                // console.log("length tags: ", this.awjson.tbl_antworten[i].tbl_antwortentags_set.length)
                for (j = 0; j < tagcount; j++) {
                  _.forEach(value[j], function (v, k) {
                    column = column + v + ";"
                    // console.log(k + ": " + v)
                  })
                }
              } else {
                header = header + key + ","
                column = column + value + ","
              }
            }
          } else {
            if (key === "bfl_durch_S") {
              column = column + value + "\n"
            } else {
              if (key === "tbl_antwortentags_set") {
                // console.log("length tags: ", this.awjson.tbl_antworten[i].tbl_antwortentags_set.length)
                for (j = 0; j < tagcount; j++) {
                  _.forEach(value[j], function (v, k) {
                    column = column + v + ";"
                    // console.log(k + ": " + v)
                  })
                }
              } else {
                column = column + value + ","
              }
            }
          }
        })
        console.log("column: ", column)
        antworten.push(column)
      }
      console.log("header: ", header)
    },
    clear () {
      this.erhebung = 0
      this.aufgabenset = 0
      this.antworten = 0
      this.awjson = {}
      // converter.json2csv(this.awjson, json2csvCallback)
    },
    exportCSV () {
      converter.json2csv(this.awjson, json2csvCallback)
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
      msg: 'nie so lala',
      awjson : {
        tbl_antworten_count: {},
        tbl_antworten: []
      },
      erhebungen : [],
      erhebung : 0,
      aufgabenset : 0,
      antworten : 0,
      erhebung_key : 0,
      csv : []
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
