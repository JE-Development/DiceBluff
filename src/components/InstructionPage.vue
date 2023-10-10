<template>
  <div class="center-horizontal" style="text-align: center" v-if="lang.lang === 'de'">
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
      <h2>Jemand verliert ein Leben. Wie geht es weiter?</h2>
      <p>
        Wenn Spieler2 ein Leben verliert und noch mehr als 0 Leben hat, kann er weiter Spielen. Jetzt darf Spieler3
        anfangen. Da er jetzt neu anfängt, muss er nicht darauf achten eine größere Zahl zu sagen und darf sagen was er will.
      </p>
      <h2>Spielablauf als Browsergame erklärt</h2>
      <p>Der Spieler der anfängt muss würfeln</p>
      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.dropButton}}</p>
        </button>
      </div>
      <p>
        Dannach kann man daruntergucken wenn man will.
      </p>
      <div class="center-horizontal">
        <button class="game-button-view center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.viewButton}}</p>
        </button>
      </div>
      <p>Nachdem geguckt wurde, ist kein Knopf mehr zu sehen. Dies liegt daran, dass man jetzt links an der Seite die Zahl
      auswählen muss, die man sagen will. Man kann schon eine Zahl sagen bevor man guckt um blind zu Spielen</p>
      <a>
        Nachdem weitergeschoben wurde, sieht der nächste Spieler 2 Knöpfe.
      </a>
      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.dropButton}}</p>
        </button>
      </div>
      <div class="center-horizontal">
        <button class="game-button-reveal center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.revealButton}}</p>
        </button>
      </div>

      <p>
        Er glaubt dem vorherigen Spieler nicht wenn 'aufdecken' gedrückt wurde. Nachdem dies gedrückt wurde, wird sofort ermittelt
        wer ein Leben verliert.
      </p>

      <p>
        Man kann auch blind weiterschieben ohne zu würfeln wenn man die Zahl links an der Seite
        auswählt, die man Sagen möchte. Sobal man das gemacht hat, erscheint ein 3. Knopf.
      </p>


      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.dropButton}}</p>
        </button>
        <button class="game-button-move center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.moveButton}}</p>
        </button>
      </div>
      <div class="center-horizontal">
        <button class="game-button-reveal center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.revealButton}}</p>
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


  <div class="center-horizontal" style="text-align: center" v-else-if="lang.lang === 'en'">
    <div style="width: 80vw">
      <h1 class="prim-color">Game Instructions</h1>
      <h2>Introduction</h2>
      <p>Dice Bluff is a dice game also known by the name 'Mäxchen.' In the physical version, Dice Bluff is played with 2 dice and a dice cup. The goal is to be the last one remaining, which is achieved through skillful bluffing and a bit of luck.
      </p>
      <h2>Composition of Numbers</h2>
      <p>
        When the dice are rolled, two different numbers are generated (except for a pair). The larger number represents the tens, and the smaller number represents the ones. So, if you roll a 5 and a 2, the resulting number is 52; if you roll a 1 and a 3, it becomes 31. The smallest number that can be rolled is 31, and the highest number is 65. After 65, the next highest is the 1st pair, followed by the 2nd pair, and so on. The highest possible roll is the 6th pair. After the 6th pair, the next highest is 21. 21 is the highest possible roll (also called "Mäxchen"). Once a 21 is rolled and announced, the dice cup is uncovered, and the next player immediately loses a life. This will be explained in more detail later.
      </p>
      <h2>Gameplay</h2>
      <p>
        Let's assume we have Player1, Player2, and Player3 in the round. Player1 starts and rolls a 42. He can choose to announce any number, but for this example, let's say he also announces 42 and passes the dice cup discreetly to Player2. Player2 now has three options:
      </p>
      <p>
        Option 1: "Believe" - Player2 believes that the announced number (42) is under the cup and rolls the dice.
      </p>
      <p>
        Option 2: "Pass" - Player2 believes that the announced number is incorrect, announces a higher number, and passes the cup to the next player. The concept of passing without rolling will be explained in more detail later.
      </p>
      <p>
        Option 3: "Don't Believe" - Player2 doesn't believe the announced number and openly reveals what is under the cup for everyone to see. If the number under the cup is smaller than the announced number, Player1 loses a life. If the number is greater than or equal to the announced number, Player2 loses a life.
      </p>
      <h2>Why do you have to lie at all?</h2>
      <p>
        Player1 has rolled a 42, and Player2 believes him. Player2 rolls, and no matter what they roll, they must announce a higher number than Player1. Player2 has now rolled a 61 and announces it. Player3 believes them and rolls as well. However, Player3 has rolled a 32. Since they must announce a higher number, they say 64. Player1 could now expose Player3 as a liar.
      </p>
      <h2>Second option explained in more detail:</h2>
      <p>Player1 has rolled a 42 and can also announce a smaller number like 32. If the announced number is smaller than what was rolled, it is NOT a lie. If Player2 uncovers the cup because they believe Player1 has lied, Player2 loses a life. Now that Player1 has announced 32, and assuming Player2 believes them, Player2 can pass the dice cup without rolling and without looking underneath. However, Player2 still has to announce a larger number. Player2 now announces 41. This makes the game more exciting because it involves taking a big risk. It can also be used strategically to harm specific players. Let's say Player1 rolls a 21 (the highest number) but announces a 6th pair. Player2 thinks that there might be a 21 under the dice cup and continues by announcing 21. Since 21 was announced, the dice cup is automatically lifted, and because 21 was indeed underneath, Player3 loses a life.
      </p>
      <h2>Playing blind</h2>
      <p>
        For added excitement, you can also roll the dice and announce a number without looking. Let's say Player1 rolls a 61. They check underneath and announce 61. Player2 believes them and rolls as well. Now, Player2 doesn't look and blindly announces 62. Player3 doesn't believe them and uncovers the cup. Under the cup was a 1st pair, and Player3 loses a life. Since the announced number (62) is smaller than what was under the cup, there was no lie. You can also continue passing in this situation. Player1 rolls a 52 and announces that number. Player2 believes, rolls, doesn't look, and blindly announces 61. Player3 believes and passes without rolling to Player1, announcing 62. Player1 believes and says 63, passing without rolling to Player2. This can go on until someone decides to roll the dice, or someone doesn't believe and uncovers the cup, or someone announces 21, which automatically leads to uncovering.
      </p>
      <h2>Someone loses a life. What happens next?</h2>
      <p>
        If Player2 loses a life but still has more than 0 lives left, they can continue playing. Now it's Player3's turn. Since Player3 is starting anew, they don't have to worry about announcing a higher number and can say any number they want.
      </p>
      <h2>Explanation of the gameplay as a browser game:</h2>
      <p>The player who starts must roll the dice.</p>
      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.dropButton}}</p>
        </button>
      </div>
      <p>
        After that, players can choose to look underneath the cup if they wish.
      </p>
      <div class="center-horizontal">
        <button class="game-button-view center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.viewButton}}</p>
        </button>
      </div>
      <p>After looking, no button is visible anymore. This is because you must now select the number you want to announce from the list on the left side. You can announce a number even before looking to play blind.</p>
      <a>
        After passing the turn, the next player sees two buttons.
      </a>
      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.dropButton}}</p>
        </button>
      </div>
      <div class="center-horizontal">
        <button class="game-button-reveal center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.revealButton}}</p>
        </button>
      </div>

      <p>
        He doesn't believe the previous player when the "reveal" button is pressed. After it's pressed, it immediately determines who loses a life.
      </p>

      <p>
        You can also blindly pass without rolling by selecting the number on the left side that you want to announce. Once you've done that, a third button appears.
      </p>


      <div class="center-horizontal">
        <button class="game-button-drop center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.dropButton}}</p>
        </button>
        <button class="game-button-move center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.moveButton}}</p>
        </button>
      </div>
      <div class="center-horizontal">
        <button class="game-button-reveal center-horizontal">
          <p style="margin-top: 5px">{{lang.gamePage.revealButton}}</p>
        </button>
      </div>
      <p>
        By "passing," the cup is moved to the next player.
      </p>
      <p>
        To determine whether a player has rolled or blindly passed, a "shake" animation is executed.
      </p>
      <div class="center-horizontal">
        <div class="shake-inf">
          <img src="../assets/cup.png" style="width: 100px" />
        </div>
      </div>
      <p>
        To determine whether a player has looked underneath after rolling, a "lift" animation is played.
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
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"


export default {
    name: "InstructionPage",
    data() {
        return {
          lang: langDE
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