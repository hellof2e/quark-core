import { QuarkElement, customElement } from "quarkc"
import style from "./index.less?inline"

@customElement({ tag: "app-article", style })
class MyComponent extends QuarkElement {
  render() {
    return (
      <main>
        <p>
          Twenty-Five Hundred years ago, Sun Tzu wrote this classic book of
          military strategy based on Chinese warfare and military thought.
        </p>
        <h2>1. Laying Plans</h2>
        <p>Sun Tzu said: The art of war is of vital importance to the State.</p>
        <p>
          It is a matter of life and death, a road either to safety or to ruin.
          Hence it is a subject of inquiry which can on no account be neglected.
        </p>
        <p>
          The art of war, then, is governed by five constant factors, to be taken
          into account in one's deliberations, when seeking to determine the
          conditions obtaining in the field.
        </p>
        <p>
          These are: (1) The Moral Law; (2) Heaven; (3) Earth; (4) The Commander;
          (5) Method and discipline.
        </p>
        <p>
          The MORAL LAW causes the people to be in complete accord with their
          ruler, so that they will follow him regardless of their lives,
          undismayed by any danger.
        </p>
        <p>HEAVEN signifies night and day, cold and heat, times and seasons.</p>
        <p>
          EARTH comprises distances, great and small; danger and security; open
          ground and narrow passes; the chances of life and death.
        </p>
        <p>
          The COMMANDER stands for the virtues of wisdom, sincerity, benevolence,
          courage and strictness.
        </p>
        <p>
          By METHOD AND DISCIPLINE are to be understood the marshaling of the army
          in its proper subdivisions, the graduations of rank among the officers,
          the maintenance of roads by which supplies may reach the army, and the
          control of military expenditure.
        </p>
        <p>
          These five heads should be familiar to every general: he who knows them
          will be victorious; he who knows them not will fail.
        </p>
        <p>
          Therefore, in your deliberations, when seeking to determine the military
          conditions, let them be made the basis of a comparison, in this wise:
        </p>
        <p>(1) Which of the two sovereigns is imbued with the Moral law?</p>
        <p>(2) Which of the two generals has most ability?</p>
        <p>(3) With whom lie the advantages derived from Heaven and Earth?</p>
        <p>(4) On which side is discipline most rigorously enforced?</p>
        <p>(5) Which army is stronger?</p>
        <p>(6) On which side are officers and men more highly trained?</p>
        <p>
          (7) In which army is there the greater constancy both in reward and
          punishment?
        </p>
        <p>
          By means of these seven considerations I can forecast victory or defeat.
        </p>
        <p>
          The general that hearkens to my counsel and acts upon it, will conquer:
          let such a one be retained in command! The general that hearkens not to
          my counsel nor acts upon it, will suffer defeat: let such a one be
          dismissed!
        </p>
        <p>
          While heeding the profit of my counsel, avail yourself also of any
          helpful circumstances over and beyond the ordinary rules.
        </p>
        <p>
          According as circumstances are favorable, one should modify one's plans.
        </p>
        <p>All warfare is based on deception.</p>
        <p>
          Hence, when able to attack, we must seem unable; when using our forces,
          we must seem inactive; when we are near, we must make the enemy believe
          we are far away; when far away, we must make him believe we are near.
        </p>
        <p>Hold out baits to entice the enemy. Feign disorder, and crush him.</p>
        <p>
          If he is secure at all points, be prepared for him. If he is in superior
          strength, evade him.
        </p>
        <p>
          If your opponent is of choleric temper, seek to irritate him. Pretend to
          be weak, that he may grow arrogant.
        </p>
        <p>If he is taking his ease, give him no rest.</p>
        <p>If his forces are united, separate them.</p>
        <p>
          Attack him where he is unprepared, appear where you are not expected.
        </p>
        <p>
          These military devices, leading to victory, must not be divulged
          beforehand.
        </p>
        <p>
          Now the general who wins a battle makes many calculations in his temple
          ere the battle is fought.
        </p>
        <p>
          The general who loses a battle makes but few calculations beforehand.
          Thus do many calculations lead to victory, and few calculations to
          defeat: how much more no calculation at all! It is by attention to this
          point that I can foresee who is likely to win or lose.
        </p>
      </main>
    );
  }
}
