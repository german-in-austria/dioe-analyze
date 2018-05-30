<template>
  <div class="hello">
    <h1>DI(ö)ANA(lyze) - alpha</h1>
    <br>
    <form id="demo">
      <p>
        <label for="erhebung">Erhebung:&nbsp</label>
        <select v-model="erhebung_key">
          <!--<option v-for="(eh, i) in erhebungen.filter[0]" :value="{i, pk: eh.pk}">-->
          <option v-on:click="testFunction" v-for="(eh, i) in erhebungen.filter[0]" :value="i">
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
      <!--<p>
        <label for="aufgabenset">Aufgabenset:&nbsp</label>
        <input v-model.number="aufgabenset" type="number" min="0" max="87">
      </p>-->
      <p>
        <label for="antworten">Anzahl Antworten:&nbsp</label>
        <input v-model.number="antworten" type="number" min="0" max="200">
      </p>
      <v-btn v-on:click="loadAnswers(erhebung,aufgabenset,antworten)">GENERATE JSON</v-btn>
      <!--<v-btn v-on:click="clear">RESET VALUES</v-btn>-->
      <!--<v-btn v-if="Object.keys(this.awjson.tbl_antworten).length>0" v-on:click="exportCSV">EXPORT CSV</v-btn>-->
      <!--<v-btn v-on:click="geterh">Testbutton</v-btn>-->
    </form>
    <b>Erhebung:</b> {{ erhebung }} &nbsp <b>Aufgabenset:</b> {{ aufgabenset }} &nbsp <b>Anzahl Antworten:</b> {{ antworten }}<br>
    <b>API-Link:</b> https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&start=0&len=<font color="red">{{ antworten }}</font>&ampfilter=erhebung:<font color="red">{{ erhebung }}</font>,aufgabenset:<font color="red">{{ aufgabenset }}</font><br>
    <h3><i>JSON currently saved to logs, CSV export and table view coming soon.</i></h3>
    <!--<br>
    <v-progress-circular v-if="Object.keys(this.awjson).length>0"
        :size="100"
        :width="15"
        :rotate="360"
        :value="value"
        color="#6699cc"
      >
      {{ value }}
    </v-progress-circular>
    <br>
    <br>
    <label v-if="Object.keys(this.awjson).length>0">table output coming soon...</label>-->
  </div>
</template>
<script>
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

    this.interval = setInterval(() => {
      if (this.value === 100) {
        return (this.value = 0)
      }
      this.value += 10
    }, 1000)
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
      console.log(this.awjson.tbl_antworten)
    },
    clear () {
      this.erhebung = 0
      this.aufgabenset = 0
      this.antworten = 0
      this.awjson = {}
      this.value = 0
      // converter.json2csv(this.awjson, json2csvCallback)
    },
    exportCSV () {
      converter.json2csv(this.awjson, json2csvCallback)
    },
    testFunction () {
      this.aufgabenset = 0
      console.log("Erhebung: ", this.erhebungen.filter[0][this.erhebung_key].pk)
      this.erhebung = this.erhebungen.filter[0][this.erhebung_key].pk
      // console.log("Erhebung SPT-D: ", this.erhebungen.filter[0][4])

      if (this.erhebungen.filter[0][this.erhebung_key].Aufgabensets[0].pk) {
        this.aufgabenset = this.erhebungen.filter[0][this.erhebung_key].Aufgabensets[0].pk
        console.log("Aufgabenset: ", this.aufgabenset)
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
      interval : {},
      erhebungen : [],
      value : 0,
      erhebung : 0,
      aufgabenset : 0,
      antworten : 0,
      erhebung_key : 0
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}
</style>
<style>
.slider {
  /* overwrite slider styles */
  width: 200px;
}
</style>
