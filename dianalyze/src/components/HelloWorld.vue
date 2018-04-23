<template>
  <div class="hello">
    <h1>DI(ö)ANA(lyze) - alpha</h1>
    <br>
    <form id="demo">
      <p>
        <label for="erhebung">Erhebung:&nbsp</label>
        <input v-model.number="erhebung" type="number" min="0" max="10">
      </p>
      <p>
        <label for="aufgabenset">Aufgabenset:&nbsp</label>
        <input v-model.number="aufgabenset" type="number" min="0" max="87">
      </p>
      <p>
        <label for="antworten">Anzahl Antworten:&nbsp</label>
        <input v-model.number="antworten" type="number" min="0" max="200">
      </p>
      <v-btn v-on:click="loadAnswers(erhebung,aufgabenset,antworten)">GET JSON</v-btn>
      <v-btn v-on:click="clear">RESET VALUES</v-btn>
    </form>
    <h3>JSON currently saved to logs, CSV export and table view coming soon.</h3>
  </div>
    <!-- <h1>Tags</h1>
    <h2 v-on:click="loadTags(100)">Test</h2>
    <ul>
      <li v-on:click="loadGWPs(tag.pk)" v-for="(tag, i) in tags">
        {{ tag.fields.Tag }}
      </li>
    </ul>
    <v-btn name="testbutton" icon=true v-on:click="loadTags(10)">Testbutton</v-btn>
    <br>
    <h3>Datenauswahl</h3>
    <input type="radio" id="one" value="Antworten" v-model="picked">
    <label for="one">Antworten</label>
    <br>
    <input type="radio" id="two" value="Tags" v-model="picked">
    <label for="two">Tags</label>
    <br>
    <input type="radio" id="three" value="Informanten" v-model="picked">
    <label for="two">Informanten</label>
    <br>
    <h3>Filter</h3>
    Erhebung:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <select v-model="selected">
      <option disabled value="">Erhebung auswählen</option>
      <option>Freundgespräch_PP0308</option>
      <option>SPT-D_PP03</option>
      <option>WSUE1-(D zu S)</option>
    </select>
    <br>
    <br>
    Aufgabenset:&nbsp;
    <select v-model="selected">
      <option disabled value="">Aufgabenset auswählen</option>
      <option>ADJS1 - Einsilbig o. Uml.</option>
      <option>SPT-D_PP03</option>
      <option>WSUE1-(D zu S)</option>
    </select>
    <v-btn>hello</v-btn>
    <v-progress-circular
        :size="100"
        :width="15"
        :rotate="360"
        :value="value"
        color="#6699cc"
      >
        {{ value }}
    </v-progress-circular>

    <<span>Picked: {{ picked }}</span>-->
    <!--<h2>GWPS ({{ gwps.length }})</h2>
    <ul>
      <li v-for="(gwp, i) in gwps">{{ gwp.inf_sigle }}</li>
    </ul>
  </div>-->
  <!--<div id="output">

  </div>-->
</template>
<script>
export default {
  name: 'HelloWorld',
  mounted () {
    this.tags = [
      {"pk": 110, "fields": {"zu_Phaenomen": 12, "Tag_lang": "keine Periphrase", "Tag": "Pe0", "AReihung": 0, "Kommentar": "PUTT", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 37, "fields": {"zu_Phaenomen": null, "Tag_lang": "Complementizer", "Tag": "COMP", "AReihung": 0, "Kommentar": "Doubly-filled Comp und Comp-Agreement", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 114, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Comp initial Tag", "Tag": "COMPi", "AReihung": 0, "Kommentar": "Einfaches tagging, wenige Details", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 108, "fields": {"zu_Phaenomen": 12, "Tag_lang": "intendierter Gegenstand", "Tag": "+intGeg", "AReihung": 1, "Kommentar": "intendierter bewegter Gegenstand wurde in Satz realisiert ", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 82, "fields": {"zu_Phaenomen": 12, "Tag_lang": "PUT und TAKE", "Tag": "PUTT", "AReihung": 1, "Kommentar": "Alle Szenenbeschreibungen mit realisierter bewegten Gegenstand", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 127, "fields": {"zu_Phaenomen": 14, "Tag_lang": "gerundeter Vokal vorhanden", "Tag": "Rund+", "AReihung": 1, "Kommentar": "", "Generation": 4}, "model": "KorpusDB.tbl_tags"}, {"pk": 54, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Comp dass als 2. Comp", "Tag": "dass", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 50, "fields": {"zu_Phaenomen": null, "Tag_lang": "keine Endung", "Tag": "-\u00d8", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 115, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Einfach: Erster Comp", "Tag": "C1Agree", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 117, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Comp Agreement realisiert", "Tag": "CA+", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 24, "fields": {"zu_Phaenomen": 13, "Tag_lang": "werden Passiv", "Tag": "werdenP", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 197, "fields": {"zu_Phaenomen": null, "Tag_lang": "Kontraktion", "Tag": "Kontr", "AReihung": 1, "Kommentar": "", "Generation": 4}, "model": "KorpusDB.tbl_tags"}, {"pk": 20, "fields": {"zu_Phaenomen": 13, "Tag_lang": "Auswertung Rezipientenpassiv", "Tag": "DATP", "AReihung": 1, "Kommentar": "Ph\u00e4nomenorientiertes Tagging f\u00fcr Rezipientenpassiv", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 29, "fields": {"zu_Phaenomen": 13, "Tag_lang": "Rezipient im Objektskasus", "Tag": "Robj", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 5, "fields": {"zu_Phaenomen": null, "Tag_lang": "entspricht Standard", "Tag": "sd+", "AReihung": 1, "Kommentar": "Variante entspricht Standard", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 185, "fields": {"zu_Phaenomen": 3, "Tag_lang": "Possessum Vater", "Tag": "Vater", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 178, "fields": {"zu_Phaenomen": 3, "Tag_lang": "Possessor Peter", "Tag": "Peter", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 2, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Adjektiv Komparativ", "Tag": "ADJK", "AReihung": 1, "Kommentar": "Ph\u00e4nomenorientiertes Tag", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 59, "fields": {"zu_Phaenomen": null, "Tag_lang": "Pr\u00e4sens", "Tag": "pres", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 39, "fields": {"zu_Phaenomen": null, "Tag_lang": "Erster Comp", "Tag": "C1", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 12, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Derivationssuffix vorhanden", "Tag": "Der+", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 169, "fields": {"zu_Phaenomen": null, "Tag_lang": "Artikel vorhanden", "Tag": "Art+", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 7, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Umlautung bei ADJK/ADJS", "Tag": "Uml", "AReihung": 1, "Kommentar": "Kategorie", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 160, "fields": {"zu_Phaenomen": null, "Tag_lang": "Genitiv-Relation", "Tag": "Gen", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 159, "fields": {"zu_Phaenomen": null, "Tag_lang": "syntaktische Relation", "Tag": "synRel", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 65, "fields": {"zu_Phaenomen": null, "Tag_lang": "Person", "Tag": "Pers", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 67, "fields": {"zu_Phaenomen": null, "Tag_lang": "1. Person", "Tag": "1", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 198, "fields": {"zu_Phaenomen": null, "Tag_lang": "Kontraktion vorhanden", "Tag": "Kontr+", "AReihung": 1, "Kommentar": "", "Generation": 5}, "model": "KorpusDB.tbl_tags"}, {"pk": 70, "fields": {"zu_Phaenomen": null, "Tag_lang": "singular", "Tag": "sg", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 154, "fields": {"zu_Phaenomen": null, "Tag_lang": "Besitz-Relation", "Tag": "Besitz", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 153, "fields": {"zu_Phaenomen": null, "Tag_lang": "semantische Relation", "Tag": "semRel", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 84, "fields": {"zu_Phaenomen": 12, "Tag_lang": "Put & Take Verb", "Tag": "PTVerb", "AReihung": 1, "Kommentar": "Kategorie Verb-Tagging f\u00fcr Put & Take", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 152, "fields": {"zu_Phaenomen": null, "Tag_lang": "Semantik", "Tag": "Sem", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 8, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Nicht umlautf\u00e4hig", "Tag": "NU", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}
    ]
    this.interval = setInterval(() => {
      if (this.value === 100) {
        return (this.value = 0)
      }
      this.value += 10
    }, 1000)
  },
  methods : {
    async loadGWPs (tagId) {
      var res = await fetch(`https://dioedb.dioe.at/restapi/test/?tag=${tagId}`)
      this.gwps = await res.json()
    },
    async loadAnswers (erh, set, length) {
      this.erhebung = erh
      this.aufgabenset = set
      this.antworten = length
      var res = await fetch(`https://dioedb.dioe.at/restapi/getAntworten?get=tbl_antworten&start=0&len=${length}&filter=erhebung:${erh},aufgabenset:${set}`)
      this.tagsnew = await res.json()
      console.log(length, this.erhebung, this.aufgabenset, this.tagsnew)
    },
    clear () {
      this.erhebung = 0
      this.aufgabenset = 0
      this.antworten = 0
    }
  },
  data () {
    return {
      msg: 'nie so lala',
      tags : [],
      gwps : [],
      tagnew : [],
      interval : {},
      value : '0',
      erhebung : '0',
      aufgabenset : '0',
      antworten : '0'
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
