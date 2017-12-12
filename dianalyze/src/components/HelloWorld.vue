<template>
  <div class="hello">
    <h1>Tags</h1>
    <ul>
      <li @click="loadGWPs(tag.pk)" v-for="(tag, i) in tags">
        {{ tag.fields.Tag }}
      </li>
    </ul>
    <h2>GWPS ({{ gwps.length }})</h2>
    <ul>
      <li v-for="(gwp, i) in gwps">{{ gwp.inf_sigle }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted () {
    this.tags = [
      {"pk": 110, "fields": {"zu_Phaenomen": 12, "Tag_lang": "keine Periphrase", "Tag": "Pe0", "AReihung": 0, "Kommentar": "PUTT", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 37, "fields": {"zu_Phaenomen": null, "Tag_lang": "Complementizer", "Tag": "COMP", "AReihung": 0, "Kommentar": "Doubly-filled Comp und Comp-Agreement", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 114, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Comp initial Tag", "Tag": "COMPi", "AReihung": 0, "Kommentar": "Einfaches tagging, wenige Details", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 108, "fields": {"zu_Phaenomen": 12, "Tag_lang": "intendierter Gegenstand", "Tag": "+intGeg", "AReihung": 1, "Kommentar": "intendierter bewegter Gegenstand wurde in Satz realisiert ", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 82, "fields": {"zu_Phaenomen": 12, "Tag_lang": "PUT und TAKE", "Tag": "PUTT", "AReihung": 1, "Kommentar": "Alle Szenenbeschreibungen mit realisierter bewegten Gegenstand", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 127, "fields": {"zu_Phaenomen": 14, "Tag_lang": "gerundeter Vokal vorhanden", "Tag": "Rund+", "AReihung": 1, "Kommentar": "", "Generation": 4}, "model": "KorpusDB.tbl_tags"}, {"pk": 54, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Comp dass als 2. Comp", "Tag": "dass", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 50, "fields": {"zu_Phaenomen": null, "Tag_lang": "keine Endung", "Tag": "-\u00d8", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 115, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Einfach: Erster Comp", "Tag": "C1Agree", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 117, "fields": {"zu_Phaenomen": 9, "Tag_lang": "Comp Agreement realisiert", "Tag": "CA+", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 24, "fields": {"zu_Phaenomen": 13, "Tag_lang": "werden Passiv", "Tag": "werdenP", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 197, "fields": {"zu_Phaenomen": null, "Tag_lang": "Kontraktion", "Tag": "Kontr", "AReihung": 1, "Kommentar": "", "Generation": 4}, "model": "KorpusDB.tbl_tags"}, {"pk": 20, "fields": {"zu_Phaenomen": 13, "Tag_lang": "Auswertung Rezipientenpassiv", "Tag": "DATP", "AReihung": 1, "Kommentar": "Ph\u00e4nomenorientiertes Tagging f\u00fcr Rezipientenpassiv", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 29, "fields": {"zu_Phaenomen": 13, "Tag_lang": "Rezipient im Objektskasus", "Tag": "Robj", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 5, "fields": {"zu_Phaenomen": null, "Tag_lang": "entspricht Standard", "Tag": "sd+", "AReihung": 1, "Kommentar": "Variante entspricht Standard", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 185, "fields": {"zu_Phaenomen": 3, "Tag_lang": "Possessum Vater", "Tag": "Vater", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 178, "fields": {"zu_Phaenomen": 3, "Tag_lang": "Possessor Peter", "Tag": "Peter", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 2, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Adjektiv Komparativ", "Tag": "ADJK", "AReihung": 1, "Kommentar": "Ph\u00e4nomenorientiertes Tag", "Generation": 0}, "model": "KorpusDB.tbl_tags"}, {"pk": 59, "fields": {"zu_Phaenomen": null, "Tag_lang": "Pr\u00e4sens", "Tag": "pres", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 39, "fields": {"zu_Phaenomen": null, "Tag_lang": "Erster Comp", "Tag": "C1", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 12, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Derivationssuffix vorhanden", "Tag": "Der+", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 169, "fields": {"zu_Phaenomen": null, "Tag_lang": "Artikel vorhanden", "Tag": "Art+", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 7, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Umlautung bei ADJK/ADJS", "Tag": "Uml", "AReihung": 1, "Kommentar": "Kategorie", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 160, "fields": {"zu_Phaenomen": null, "Tag_lang": "Genitiv-Relation", "Tag": "Gen", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 159, "fields": {"zu_Phaenomen": null, "Tag_lang": "syntaktische Relation", "Tag": "synRel", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 65, "fields": {"zu_Phaenomen": null, "Tag_lang": "Person", "Tag": "Pers", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 67, "fields": {"zu_Phaenomen": null, "Tag_lang": "1. Person", "Tag": "1", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 198, "fields": {"zu_Phaenomen": null, "Tag_lang": "Kontraktion vorhanden", "Tag": "Kontr+", "AReihung": 1, "Kommentar": "", "Generation": 5}, "model": "KorpusDB.tbl_tags"}, {"pk": 70, "fields": {"zu_Phaenomen": null, "Tag_lang": "singular", "Tag": "sg", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 154, "fields": {"zu_Phaenomen": null, "Tag_lang": "Besitz-Relation", "Tag": "Besitz", "AReihung": 1, "Kommentar": "", "Generation": 3}, "model": "KorpusDB.tbl_tags"}, {"pk": 153, "fields": {"zu_Phaenomen": null, "Tag_lang": "semantische Relation", "Tag": "semRel", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}, {"pk": 84, "fields": {"zu_Phaenomen": 12, "Tag_lang": "Put & Take Verb", "Tag": "PTVerb", "AReihung": 1, "Kommentar": "Kategorie Verb-Tagging f\u00fcr Put & Take", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 152, "fields": {"zu_Phaenomen": null, "Tag_lang": "Semantik", "Tag": "Sem", "AReihung": 1, "Kommentar": "", "Generation": 1}, "model": "KorpusDB.tbl_tags"}, {"pk": 8, "fields": {"zu_Phaenomen": 14, "Tag_lang": "Nicht umlautf\u00e4hig", "Tag": "NU", "AReihung": 1, "Kommentar": "", "Generation": 2}, "model": "KorpusDB.tbl_tags"}
    ]
  },
  methods : {
    async loadGWPs (tagId) {
      var res = await fetch(`https://dioedb.dioe.at/restapi/test/?tag=${tagId}`)
      this.gwps = await res.json()
    }
  },
  data () {
    return {
      msg: 'Welcome to the! You think this site has nothing special to offer? I find your lack of faith disturbing! Darth Vueder',
      tags : [],
      gwps : []
    }
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
