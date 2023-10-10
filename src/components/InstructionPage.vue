<template>
  <div class="center-horizontal" style="text-align: center">
    <div style="width: 80vw">
      <h1 class="prim-color">Spielanleitung</h1>
      <h2>Einführung</h2>
      <p>Dice Bluff ist ein Würfelspiel welches man auch unter dem Namen 'Mäxchen' kennt. Physisch wird Dice Bluff mit
        2 Würfeln und einem Würfelbecher gespielt. Das Ziel ist es als letztes übrig zu sein. Dies erreicht man durch gutes Lügen
        und viel Glück.
      </p>
      <h2>Zusammensetzung der Zahlen</h2>
      <p>
        Wenn die Würfeln geworfen werden, enstehen 2 verschiedene Zahlen (ausgenommen Pasch). Die größere Zahl ist dabei der
        Zehner und die kleinere Zahl ist der Einer. Also wenn 5 und 2 gewürfelt wurde, ensteht die Zahl 52, bei 1 und 3
        wäre es die 31. Die kleinste Zahl die geworfen werden kann ist 31. Die höchste Zahl die somit gewürfelt werden
        kann ist 65. Nach 65 ist das Nächsthöchste der 1. Pasch und dann der 2. Pasch usw. Das höchste hier wäre der 6. Pasch.
        Nach dem 6. Pasch ist das Nächsthöchste 21. 21 ist das Allerhöchste was gewürfelt werden kann (21 wird auch
        Mäxchen genannt). Sobalt eine 21 gewürfelt wurde und die Zahl auch gesagt wurde, wird der Becher aufgedeckt und
        der nächste Spieler verliert sofort ein Leben. Dies wird noch später genauer erklärt.
      </p>
      <h2>Spielablauf</h2>
      <p>
        Nehmen wir an wir haben Spieler1, Spieler2 und Spieler3 in der Runde. Spieler1 fängt an und würfelt eine 42.
        Er kann jede Zahl sagen, aber wir nehmen an, dass er auch die 42 sagt
        und schiebt verdeckt den Becher weiter zu Spieler2. Spieler2 hat nun 3 Möglichkeiten:
      </p>
      <p>
        1. Möglichkeit 'glauben': Spieler2 glaubt, dass das Gesagte (42) auch unter dem Becher ist und Würfelt
      </p>
      <p>
        2. Möglichkeit 'weiterschieben': Spieler2 glaubt, dass das Gesagte, sagt eine höhre Zahl und schiebt weiter.
        Das Prinzip des Weiterschiebens ohne zu Würflen wird nochmal später genauer erklärt.
      </p>
      <p>
        3. Möglichkeit 'nicht glauben': Spieler2 glaubt nicht das Gesagte und deckt für alle Sichtbar auf. Ist nun die
        Zahl die unter dem Becher liegt kleiner als das Gesgate, verliert Spieler1 ein Leben. Ist die Zahl größer oder
        gleich als das Gesagte, verliert Spieler2 ein Leben.
      </p>
      <h2>Warum muss man überhaubt lügen?</h2>
      <p>
        Spieler1 hat jetzt 42 gewürfelt und Spieler2 glaubt ihm. Spieler2 würfelt und egal was er würfelt, er muss eine
        höhere Zahl sagen als Spieler1. Spieler2 hat jetzt eine 61 gewürfelt und sagt dies auch. Spieler3 glaubt ihm und
        würfelt auch. Spieler3 hat aber eine 32 gewürfelt. Da er eine höhere Zahl sagen muss, sagt er 64. Spieler1 könnte
        jetzt Spieler3 als Lügner entlarven.
      </p>
      <h2>2. Möglichkeit genauer erklärt</h2>
      <p>Spieler1 hat eine 42 gewürfelt und er kann auch eine kleinere Zahl sagen wie 32. Wenn die gesagte Zahl kleiner ist
        als gewürfelt, ist es NICHT gelogen und wenn Spieler2 den Becher aufdeckt, weil Spieler2 denkt, dass Spieler1 gelogen
        hat, verliert Spieler2 ein Leben. Weil Spieler1 jetzt 32 gesagt hat und Spieler2 angenommen ihm glaubt, kann
        Spieler2 den Würfelbecher weiterschieben ohne zu würfeln und ohne darunterzugucken. Aber Spieler2 muss dennoch
        eine größere Zahl sagen. Spieler2 sagt jetzt 41. Dadurch wird das Spiel spannender, weil man ein großes Risiko eingeht.
        Es kann auch dafür genutzt werden, gezielt Spieler zu schädigen. Nehmen wir an Spieler1 würfelt eine 21 (Die höchste Zahl)
        aber sagt ein 6. Pasch. Spieler2 denkt, dass unter dem Würfelbecher eine 21 liegen kann und schiebt weiter und sagt 21.
        Da 21 gesagt wurde, wird der Würfelbecher automatisch angehoben und weil 21 auch darunter lag, verliert Spieler3 ein
        Leben.
      </p>
      <h2>Blind spielen</h2>
      <p>
        Für mehr Spannung kann man auch würfeln und eine Zahl sagen ohne zu gucken. Nehmen wir an Spieler1 würfelt eine 61.
        Er guckt drunter und sagt auch 61. Spieler2 glaubt und würfelt auch. Jetzt guckt er nicht und sagt blind 62. Spieler3
        glaubt ihm nicht und deckt auf. Unter dem Becher lag ein 1. Pasch und Spieler3 verliert ein Leben. Da das Gesgate (62)
        kleiner ist als was unter dem Becher lag, wurde nicht gelogen. Man kann auch hier weiterschieben. Spieler1 würfelt eine 52,
        und sagt diese Zahl auch. Spieler2 glaubt, würfelt, guckt nicht und sagt blind eine 61. Spieler3 glaubt und schiebt
        ohne zu würfeln weiter an Spieler1 und sagt 62. Spieler1 glaubt auch, sagt 63 und schiebt ohne zu würfeln weiter an Spieler2.
        Dies kann so lange weitergehen bis jemand sich entscheidet doch noch zu würfeln, oder jemand glaubt nicht und deckt auf,
        oder jemand hat 21 gesagt so das automatisch aufgedeckt wird.
      </p>
      <h2>Jemand verliert ein Leben. Wie geht es weiter</h2>
      <p>
        Wenn Spieler2 ein Leben verliert und noch mehr als 0 Leben hat, kann er weiter Spielen. Jetzt darf Spieler3
        anfangen. Da er jetzt neu anfängt, muss er nicht darauf achten eine größere Zahl zu sagen und darf sagen was er will.
      </p>
      <h2>Spielablauf als Browsergame erklärt</h2>
      <p>Der Spieler der anfängt muss würfeln</p>
      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">würflen</p>
        </button>
      </div>
      <p>
        Dannach kann man daruntergucken wenn man will.
      </p>
      <div class="center-horizontal">
        <button class="game-button-view center-horizontal">
          <p style="margin-top: 5px">gucken</p>
        </button>
      </div>
      <p>Nachdem geguckt wurde, ist kein Knopf mehr zu sehen. Dies liegt daran, dass man jetzt links an der Seite die Zahl
      auswählen muss, die man sagen will. Man kann schon eine Zahl sagen bevor man guckt um blind zu Spielen</p>
      <a>
        Nachdem weitergeschoben wurde, sieht der nächste Spieler 2 Knöpfe
      </a>
      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">würflen</p>
        </button>
      </div>
      <div class="center-horizontal">
        <button class="game-button-reveal center-horizontal">
          <p style="margin-top: 5px">aufdecken</p>
        </button>
      </div>

      <p>
        Er glaubt dem vorherigen Spieler nicht wenn 'aufdecken' gedrückt wurde. Nachdem dies gedrückt wurde, wird sofort ermittelt
        wer ein Leben verliert.
      </p>

      <p>
        Man kann auch blind weiterschieben ohne zu würfeln wenn man die Zahl links an der Seite
        auswählt, die man Sagen möchte. Sobal man das gemacht hat, erscheint ein 3. Knopf
      </p>


      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">würflen</p>
        </button>
        <button class="game-button-move center-horizontal">
          <p style="margin-top: 5px">schieben</p>
        </button>
      </div>
      <div class="center-horizontal">
        <button class="game-button-reveal center-horizontal">
          <p style="margin-top: 5px">aufdecken</p>
        </button>
      </div>
      <p>
        Durch 'schieben' wird der Becher zum nächsten Spieler geschoben.
      </p>
      <p>
        Um zu erkennen ob ein Spieler gewürfelt hat oder blind weiterschiebt, wird eine 'shake' Animation ausgeführt.
      </p>
      <div class="center-horizontal">
        <div class="shake-inf">
          <img src="../assets/cup.png" style="width: 100px" />
        </div>
      </div>
      <p>
        Um zu erkennen ob nach dem Würfeln daruntergeguckt wurde, wird eine 'hochheben' Animation abgespielt.
      </p>

      <div class="center-horizontal">
        <div class="absolute">
          <img src="../assets/dice_default.png" style="margin-right: 10px; width: 30px; margin-top: 130px"/>
          <img src="../assets/dice_default.png" style="width: 30px"/>
        </div>
        <img src="../assets/cup.png" class="cup-look-open-inf" style="width: 100px" />
      </div>
      <div style="height: 70px"></div>
    </div>
  </div>
</template>


<script>

export default {
    name: "InstructionPage",
    data() {
        return {

        };
    },

    created() {
    },

    mounted() {
    },

    methods: {

        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },

    }
}
</script>