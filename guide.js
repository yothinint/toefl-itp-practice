// Study guide shown on the "คู่มือเตรียมสอบ" page. Tips sections are Thai translations of the
// tips pages in the course handout; the rest is supplementary material for this exam format.
(() => {
  const vocab = (rows) => `<div class="tbl vocab"><table><thead><tr><th>คำ / สำนวน</th><th>ความหมาย</th><th>ตัวอย่าง / หมายเหตุ</th></tr></thead><tbody>${
    rows.map(([w, m, ex]) => `<tr><td class="en"><b>${w}</b></td><td>${m}</td><td class="en ex">${ex || ''}</td></tr>`).join('')}</tbody></table></div>`;

  window.GUIDE = [
    {
      id: 'overview',
      title: 'ภาพรวมข้อสอบ',
      body: `
<p>TOEFL ITP (Institutional Testing Program) คือข้อสอบวัดระดับภาษาอังกฤษมาตรฐานสากล เน้นภาษาที่ใช้ในบริบทวิชาการ ข้อสอบทั้งหมดเป็นแบบปรนัย 4 ตัวเลือก วัดทักษะ 3 ด้าน</p>
<div class="tbl"><table><thead><tr><th>Section</th><th>จำนวนข้อ</th><th>เวลา</th><th>ช่วงคะแนน</th></tr></thead><tbody>
<tr><td><b>1. Listening Comprehension</b><br>Part A บทสนทนาสั้น 30 ข้อ<br>Part B บทสนทนายาว 2 เรื่อง (7–9 ข้อ)<br>Part C บทพูด/บรรยาย 3 เรื่อง (11–13 ข้อ)</td><td>50</td><td>ประมาณ 35 นาที</td><td>31–68</td></tr>
<tr><td><b>2. Structure and Written Expression</b><br>เติมประโยค 15 ข้อ<br>หาจุดผิด 25 ข้อ</td><td>40</td><td>25 นาที</td><td>31–68</td></tr>
<tr><td><b>3. Reading Comprehension</b><br>บทความ 5 เรื่อง</td><td>50</td><td>55 นาที</td><td>31–67</td></tr>
<tr><td><b>รวม</b></td><td>140</td><td>ประมาณ 2 ชั่วโมง</td><td>310–677</td></tr>
</tbody></table></div>
<div class="callout"><b>วิธีคิดคะแนนรวม:</b> นำคะแนนทั้ง 3 Section มาบวกกัน คูณ 10 แล้วหาร 3 เช่น 50 + 52 + 51 = 153 × 10 ÷ 3 = 510 คะแนน</div>
<div class="callout ok"><b>ตอบผิดไม่ติดลบ:</b> ห้ามเว้นว่างเด็ดขาด ข้อที่ไม่รู้ให้ตัดตัวเลือกที่ผิดชัดๆ ออกแล้วเดา และควรเลือกตัวอักษรเดาไว้ตัวเดียวตลอด เช่นเดา C ทุกข้อที่ไม่รู้</div>`
    },
    {
      id: 'listening-tips',
      title: 'Listening: เคล็ดลับ',
      body: `
<h3>เคล็ดลับจากเอกสาร (แปล)</h3>
<ul>
<li>ระหว่างสอบให้ตั้งใจฟัง 100% เพราะบทสนทนาและบทพูดเล่นให้ฟังเพียงครั้งเดียว อย่าฟังแค่คำศัพท์ทีละคำ แต่ให้ฟังความหมายรวมของวลีและประโยค และสังเกต<b>น้ำเสียง</b>ของผู้พูดด้วย เพราะน้ำเสียงอาจเปลี่ยนความหมายและเจตนาของผู้พูดได้</li>
<li>ใน Part A (บทสนทนาสั้น) ให้ตั้งใจฟัง<b>ผู้พูดคนที่สอง</b>เป็นพิเศษ ไม่ต้องกังวลถ้าพลาดสิ่งที่คนแรกพูด บ่อยครั้งที่ยังตอบได้ถ้าเข้าใจสิ่งที่คนที่สองพูด</li>
<li>ในชีวิตประจำวัน ใช้ทุกโอกาสฟังภาษาอังกฤษที่ดี โดยเฉพาะเนื้อหาเชิงวิชาการ เช่น การดูสารคดี แต่ฟังอะไรก็มีประโยชน์ทั้งนั้น สังเกตทั้งคำศัพท์ที่ใช้และความหมายของสิ่งที่พูด</li>
</ul>
<h3>กลยุทธ์เพิ่มเติม</h3>
<ul>
<li><b>อ่านตัวเลือกล่วงหน้า:</b> ใช้ช่วงเงียบ 12 วินาทีหลังตอบข้อหนึ่งเสร็จ อ่านตัวเลือกของข้อถัดไปเพื่อเดาว่าจะถามเรื่องอะไร</li>
<li><b>ตอบทันที อย่าค้าง:</b> ถ้าไม่แน่ใจให้เลือกไว้ก่อนแล้วไปข้อต่อไป ถ้ามัวคิดจะพลาดบทสนทนาถัดไป</li>
<li><b>ระวังตัวเลือกที่มีคำเหมือนในเสียง:</b> ตัวเลือกที่ใช้คำเดียวกับที่ได้ยินหรือเสียงคล้ายกัน มักเป็นตัวหลอก คำตอบที่ถูกมักใช้คำพ้องความหมาย (paraphrase) เช่น ได้ยิน "taking it easy" แต่คำตอบคือ "get more rest"</li>
<li><b>Part B และ C:</b> คำถามมักเรียงตามลำดับเนื้อหา ข้อแรกมักถามใจความหลัก (main idea) ฟังชื่อเฉพาะ ตัวเลข สถานที่ และสิ่งที่อาจารย์สั่งให้ทำ (เช่น "I'd like you each to...")</li>
<li><b>คำถาม "What will ... probably do?"</b> คำตอบมักอยู่ในประโยคสุดท้ายของบทสนทนา</li>
</ul>
<h3>รูปแบบความหมายแฝงที่ออกบ่อยใน Part A</h3>
<div class="tbl"><table><thead><tr><th>รูปแบบ</th><th>ตัวอย่างที่ได้ยิน</th><th>ความหมายจริง</th></tr></thead><tbody>
<tr><td>ให้คำแนะนำ</td><td class="en">Have you checked...? / Why don't you...? / You might want to... / If I were you...</td><td>แนะนำว่าควรทำสิ่งนั้น (ข้อ 1 ในชุดนี้)</td></tr>
<tr><td>สื่อเป็นนัย (imply)</td><td class="en">"Well, his racket's here on the table."</td><td>ไม่ตอบตรงๆ ต้องอนุมาน: ไม้ยังอยู่ แปลว่ายังไม่ไปเล่น น่าจะอยู่แถวนี้ (ข้อ 6)</td></tr>
<tr><td>ปฏิเสธ + เปรียบเทียบ</td><td class="en">couldn't be better / couldn't agree more / I've never felt better</td><td>ดีที่สุด / เห็นด้วยอย่างยิ่ง (ความหมาย<b>บวก</b>)</td></tr>
<tr><td>ปฏิเสธซ้อน</td><td class="en">It's not unusual... / I'm not unhappy...</td><td>เป็นเรื่องปกติ / ก็พอใจ (ความหมายบวก)</td></tr>
<tr><td>เห็นด้วย</td><td class="en">So do I. / Me too. / You can say that again. / I'll say! / Same here.</td><td>เห็นด้วย</td></tr>
<tr><td>เห็นด้วยกับประโยคปฏิเสธ</td><td class="en">Neither do I. / Me neither. / Nor can I.</td><td>ฉันก็ไม่...เหมือนกัน</td></tr>
<tr><td>ไม่เห็นด้วย/สงสัย</td><td class="en">I'm not so sure. / I wouldn't count on it. / That's what you think.</td><td>ไม่เห็นด้วย คิดว่าไม่เป็นอย่างนั้น (ข้อ 3)</td></tr>
<tr><td>เงื่อนไขที่ไม่จริง</td><td class="en">If I had known, I would have come.</td><td>ความจริงคือ<b>ไม่รู้</b> และ<b>ไม่ได้มา</b></td></tr>
<tr><td>ความปรารถนา</td><td class="en">I wish I had more time.</td><td>ความจริงคือมีเวลาไม่พอ</td></tr>
<tr><td>ประหลาดใจ</td><td class="en">You mean she's not coming? / Wasn't the test today?</td><td>ผู้พูดเคยคิดว่าเป็นอีกแบบ แล้วแปลกใจ</td></tr>
<tr><td>ยอมรับแบบไม่เต็มใจ</td><td class="en">I still have a lot to do... but maybe a break would do me good.</td><td>สุดท้ายตัดสินใจไป (ข้อ 10)</td></tr>
</tbody></table></div>`
    },
    {
      id: 'idioms',
      title: 'สำนวน & Phrasal Verbs',
      body: `
<p>Part A ชอบใช้สำนวนในบทสนทนา ถ้ารู้ความหมายของสำนวนก็ตอบได้ทันที คำตอบที่ถูกมักแปลสำนวนเป็นภาษาธรรมดา</p>
<h3>สำนวนที่เจอในข้อสอบชุดนี้</h3>
${vocab([
  ['shake (a cold)', 'หายจาก (หวัด) สลัดอาการป่วยออกไป', "I can't seem to shake this cold."],
  ['take it easy', 'พักผ่อน ทำตัวสบายๆ ไม่หักโหม', 'Sometimes the only thing that helps is taking it easy.'],
  ['get off the ground', 'เริ่มต้นได้สำเร็จ (never got off the ground = จัดไม่สำเร็จ ล่มตั้งแต่ยังไม่เริ่ม)', 'It never really got off the ground.'],
  ['straighten out', 'แก้ไขให้เรียบร้อย คลี่คลาย', 'It should be straightened out by next week.'],
  ['do (someone) good', 'เป็นผลดีต่อ...', 'Maybe a break would do me good.'],
  ['hit it off (with)', 'เข้ากันได้ดี ถูกคอ', 'If my roommate and I had hit it off better...'],
  ['have a rough time', 'เจอช่วงที่ลำบาก', "You've had a rough time adjusting."],
  ['at the last minute', 'นาทีสุดท้าย', 'Don\'t wait until the last minute.'],
  ["be stuck", 'ติดขัด คิดต่อไม่ออก', "I'm stuck, too."],
  ['be thinking of someone else', 'จำสลับกับคนอื่น เข้าใจผิดคน', 'You must be thinking of someone else.'],
  ['hear (from someone)', 'ได้รับข่าว/การติดต่อ', "I'm still waiting to hear."],
])}
<h3>สำนวนที่ออกบ่อยในข้อสอบแนวนี้</h3>
${vocab([
  ['under the weather', 'ไม่ค่อยสบาย', "I'm feeling a bit under the weather."],
  ['hit the books', 'ตั้งใจอ่านหนังสือ', "I'd better hit the books tonight."],
  ['call it a day', 'พอแค่นี้ เลิกทำวันนี้', "Let's call it a day."],
  ['a piece of cake', 'ง่ายมาก', 'The quiz was a piece of cake.'],
  ['on the tip of my tongue', 'นึกออกแต่พูดไม่ออก', 'Her name is on the tip of my tongue.'],
  ['out of the question', 'เป็นไปไม่ได้', 'Another extension is out of the question.'],
  ['in the same boat', 'ตกที่นั่งเดียวกัน', "Don't worry, we're all in the same boat."],
  ['see eye to eye', 'เห็นตรงกัน', "We don't see eye to eye on that."],
  ['be all ears', 'พร้อมฟังเต็มที่', "Go ahead, I'm all ears."],
  ['sleep on it', 'ขอคิดดูก่อน (ข้ามคืน)', "Let me sleep on it."],
  ['a long shot', 'โอกาสน้อยมาก', "It's a long shot, but I'll apply."],
  ['by the skin of one\'s teeth', 'รอดแบบเฉียดฉิว', 'He passed by the skin of his teeth.'],
  ['once in a blue moon', 'นานๆ ครั้ง', 'I eat out once in a blue moon.'],
  ['make ends meet', 'หาเงินให้พอใช้', "It's hard to make ends meet."],
  ['get the hang of', 'เริ่มจับทางได้ เริ่มคล่อง', "You'll get the hang of it."],
  ['from scratch', 'เริ่มจากศูนย์', 'I had to rewrite it from scratch.'],
  ['in the long run', 'ในระยะยาว', 'It will save money in the long run.'],
  ['give (someone) a hand', 'ช่วยเหลือ', 'Can you give me a hand?'],
  ['let (someone) down', 'ทำให้ผิดหวัง', "I won't let you down."],
  ['can\'t make it', 'มาไม่ได้ ไปไม่ทัน', "Sorry, I can't make it tonight."],
  ['It\'s up to you', 'แล้วแต่คุณ', ''],
  ['No wonder...', 'มิน่าล่ะ', "No wonder you're tired."],
])}
<h3>Phrasal verbs ที่ควรรู้</h3>
${vocab([
  ['put off', 'เลื่อนออกไป', "Don't put off your assignment."],
  ['turn down', 'ปฏิเสธ', 'She turned down the job offer.'],
  ['look into', 'ตรวจสอบ หาข้อมูล', "I'll look into it."],
  ['figure out', 'คิดออก เข้าใจ', "I can't figure out this problem."],
  ['run into', 'บังเอิญเจอ', 'I ran into Tom at the library.'],
  ['come down with', 'เริ่มป่วยเป็น...', "I'm coming down with the flu."],
  ['fill in for', 'ทำหน้าที่แทน', 'Can you fill in for me on Friday?'],
  ['drop by / stop by', 'แวะ', 'Drop by my office after class.'],
  ['catch up on', 'ตามทำสิ่งที่ค้าง', 'I need to catch up on my reading.'],
  ['go over', 'ทบทวน ตรวจดู', "Let's go over the notes."],
  ['hand in', 'ส่ง (งาน)', 'Hand in your paper by the twelfth.'],
  ['sign up for', 'ลงทะเบียน สมัคร', 'Did you sign up for the trip?'],
  ['drop out (of)', 'ลาออก ถอนตัว', 'He dropped out of the course.'],
  ['work out', 'ออกกำลังกาย / ลงตัว สำเร็จ', 'Things worked out in the end.'],
  ['pick up', 'ไปรับ / ซื้อ / เรียนรู้', 'Pick up a schedule at the office.'],
  ['run out of', 'หมด ไม่เหลือ', "We've run out of paper."],
  ['get along with', 'เข้ากันได้', 'He does not get along with his roommate.'],
  ['look forward to + V-ing', 'ตั้งตารอ', 'I look forward to hearing from you.'],
])}`
    },
    {
      id: 'structure-tips',
      title: 'Structure: เคล็ดลับ',
      body: `
<h3>เคล็ดลับจากเอกสาร (แปล)</h3>
<ul>
<li>ใช้ทุกโอกาสอ่านภาษาอังกฤษในชีวิตประจำวัน โดยเฉพาะเอกสารเชิงวิชาการและการศึกษา</li>
<li>เวลาอ่านภาษาอังกฤษ ให้สังเกตโครงสร้างประโยค หา<b>กริยาหลัก</b>ของประโยคและ<b>อนุประโยค</b> (ถ้ามี) และดูรูปของคำที่ใช้ แล้วเชื่อมโยงสิ่งที่สังเกตเข้ากับไวยากรณ์ที่เคยเรียนมา กุญแจสำคัญไม่ใช่แค่รู้กฎไวยากรณ์ แต่ต้องนำกฎไปใช้กับประโยคจริงได้</li>
<li>ฝึกเขียนภาษาอังกฤษ แม้ปัจจุบัน TOEFL ITP จะไม่มีการสอบเขียนโดยตรง แต่ยิ่งฝึกเขียนและให้ครูที่เชี่ยวชาญช่วยตรวจมากเท่าไร ก็จะทำ Section 2 ได้ดีขึ้นเท่านั้น</li>
<li>มีเวลา 25 นาทีสำหรับ 40 ข้อ ควรคุมเวลาให้ใช้ประมาณ<b>ครึ่งนาทีต่อข้อ</b></li>
<li>ส่วนหาจุดผิดมีกลยุทธ์ได้หลายแบบ คนที่ภาษาอังกฤษดีมากจะอ่านแล้ว "รู้สึก" ได้เลยว่าผิดตรงไหน ส่วนคนที่พื้นฐานน้อยกว่าจะดูรูปคำและโครงสร้างประโยค แล้วใช้กฎไวยากรณ์ช่วยหาจุดผิด ส่วนใหญ่ต้องใช้ทั้งสองวิธีร่วมกัน</li>
</ul>
<h3>ขั้นตอนทำข้อเติมคำ (Sentence Completion)</h3>
<ol>
<li>หา<b>ประธานและกริยาหลัก</b>ของประโยคก่อน ว่ามีแล้วหรือยังขาดอยู่</li>
<li>นับอนุประโยค: จำนวนกริยาแท้ = จำนวนคำเชื่อม + 1 ถ้ากริยาเกินแปลว่าต้องเติมคำเชื่อม ถ้ามีคำเชื่อมเกินแปลว่าต้องเติมกริยา</li>
<li>ตัดตัวเลือกที่ทำให้มีประธานซ้ำ (เช่น <span class="en">"they are growing"</span>) หรือกริยาซ้ำ</li>
<li>คำตอบที่ถูกมักสั้นและกระชับ ตัวเลือกที่ยาวและมีคำเกินมักผิด (เช่น <span class="en">"being that"</span>)</li>
</ol>
<h3>ขั้นตอนทำข้อหาจุดผิด (Error Identification)</h3>
<ol>
<li>อ่านทั้งประโยคก่อน แล้วดูเฉพาะ 4 ส่วนที่ขีดเส้นใต้ ส่วนที่ไม่ได้ขีดเส้นใต้ถือว่าถูกเสมอ</li>
<li>เช็กตามรายการ: รูปคำ (word form) → เอกพจน์/พหูพจน์ → การผันกริยา → สรรพนาม → โครงสร้างขนาน → คำบุพบท/คำเชื่อม → article</li>
<li>จุดผิดมีเพียงจุดเดียว ถ้าแก้แล้วประโยคถูกทั้งหมดแปลว่าเจอแล้ว</li>
</ol>`
    },
    {
      id: 'grammar',
      title: 'Structure: ไวยากรณ์ที่ต้องรู้',
      body: `
<p>หัวข้อไวยากรณ์ที่ออกบ่อยที่สุดใน Section 2 พร้อมตัวอย่างจากข้อสอบชุดนี้</p>
<div class="gram">
<div class="g"><h4>1. ทุกประโยคต้องมีประธาน + กริยาแท้</h4>
<p class="en">✗ Many food preservation methods for inhibiting...<br>✓ <u>There are</u> many food preservation methods for inhibiting...</p>
<p>ใช้ <span class="en">There is/are + นาม</span> เมื่อประโยคยังไม่มีกริยา (Structure ข้อ 6) และอย่าเติมประธานซ้ำ (ข้อ 9: <span class="en">Frogs and toads must have...</span>)</p></div>

<div class="g"><h4>2. Appositive (นามวลีขยายนาม)</h4>
<p class="en">✓ In making cheese, <u>casein, the chief milk protein,</u> is coagulated...</p>
<p>นามวลีคั่นด้วยจุลภาค ใช้ขยายนามข้างหน้า และไม่มีกริยาในตัว (ข้อ 2)</p></div>

<div class="g"><h4>3. Relative clause และการลดรูป</h4>
<p class="en">Sensory structures <u>that grow</u> from the heads... are called antennae.<br>the oil <u>(which is) obtained</u> from its seeds</p>
<p>ประโยคมีกริยาหลักแล้ว (<span class="en">are called</span>) ส่วนขยายต้องเป็น <span class="en">that/which + V</span> หรือลดรูปเป็น <b>V-ing</b> (ความหมาย active) / <b>V3</b> (ความหมาย passive) (ข้อ 3, 7)</p></div>

<div class="g"><h4>4. คำเชื่อม vs คำบุพบท</h4>
<div class="tbl"><table><thead><tr><th>ตามด้วยอนุประโยค (S + V)</th><th>ตามด้วยคำนาม/นามวลี</th></tr></thead><tbody>
<tr><td class="en">because</td><td class="en">because of, due to</td></tr>
<tr><td class="en">although, even though, though</td><td class="en">despite, in spite of</td></tr>
<tr><td class="en">while, when</td><td class="en">during</td></tr>
</tbody></table></div>
<p class="en">✗ Because incomplete records → ✓ Because of incomplete records (ข้อ 13)<br>✗ while the Depression → ✓ during the Depression (ข้อ 16)<br>✓ Even though the United States consists of... (ข้อ 5)</p></div>

<div class="g"><h4>5. โครงสร้างขนาน (Parallel structure)</h4>
<p>สิ่งที่เชื่อมด้วย <span class="en">and, or, but</span> ต้องเป็นชนิดคำเดียวกัน</p>
<p class="en">✗ The novelty, high speed, and advantageously → ✓ ... and <u>advantage</u> (ข้อ 12)<br>✗ striking, strumming, scraping, or is blown → ✓ ... or <u>blowing</u> (ข้อ 20)</p></div>

<div class="g"><h4>6. รูปคำ (Word forms)</h4>
<div class="tbl"><table><thead><tr><th>ชนิดคำ</th><th>คำลงท้ายที่พบบ่อย</th><th>ตำแหน่งในประโยค</th></tr></thead><tbody>
<tr><td>คำนาม (n.)</td><td class="en">-tion, -sion, -ment, -ness, -ity, -ance, -ence, -th</td><td>ประธาน กรรม หลัง article/คำบุพบท</td></tr>
<tr><td>คุณศัพท์ (adj.)</td><td class="en">-ous, -ful, -ive, -al, -able, -ic, -less</td><td>หน้าคำนาม หลัง be/seem/become</td></tr>
<tr><td>กริยาวิเศษณ์ (adv.)</td><td class="en">-ly</td><td>ขยายกริยา คุณศัพท์ หรือกริยาวิเศษณ์ด้วยกัน</td></tr>
<tr><td>กริยา (v.)</td><td class="en">-ize, -ify, -en, -ate</td><td>หลังประธาน</td></tr>
</tbody></table></div>
<p class="en">✗ conserves warm → ✓ conserves <u>warmth</u> (ข้อ 15)<br>✓ <u>highly</u> sensitive (adv. ขยาย adj.)</p></div>

<div class="g"><h4>7. นามนับได้ / นับไม่ได้</h4>
<div class="tbl"><table><thead><tr><th>นามนับได้ (พหูพจน์)</th><th>นามนับไม่ได้</th></tr></thead><tbody>
<tr><td class="en">many, few, a few, a number of, fewer</td><td class="en">much, little, a little, an amount of, less</td></tr>
</tbody></table></div>
<p class="en">✗ much life-forms → ✓ <u>many</u> life-forms (ข้อ 14)<br>✗ from dry area → ✓ from dry <u>areas</u> (ข้อ 19)</p></div>

<div class="g"><h4>8. สรรพนาม (Pronouns)</h4>
<p>ประธานใช้ <span class="en">I, he, she, they</span> ส่วนกรรมใช้ <span class="en">me, him, her, them</span> และความเป็นเจ้าของใช้ <span class="en">my, his, her, their</span> สรรพนามต้องสอดคล้องกับคำนามที่อ้างถึงทั้งเรื่องจำนวนและเพศ</p>
<p class="en">✗ when her began to paint → ✓ when <u>she</u> began (ข้อ 11)</p></div>

<div class="g"><h4>9. การเปรียบเทียบ</h4>
<p class="en">adj-er + than / more + adj + than / the + adj-est<br>✓ can be <u>smaller and lighter than</u> conventional cables (ข้อ 1)</p>
<p>ดูให้ดีว่าใช้คู่กันถูก เช่น <span class="en">as...as, more...than, the same as, different from</span></p></div>

<div class="g"><h4>10. Article และคำนำหน้านาม</h4>
<p>นามนับได้เอกพจน์ต้องมีคำนำหน้า (<span class="en">a/an/the/his/its</span>...) เสมอ</p>
<p class="en">✗ best known for great novel → ✓ for <u>his</u> great novel (ข้อ 17)</p></div>

<div class="g"><h4>11. รูปแบบกริยา (Verb patterns)</h4>
<div class="tbl"><table><tbody>
<tr><td class="en">enable / allow / cause / encourage + sb + <b>to V</b></td><td class="en">to enable students to practice (ข้อ 4)</td></tr>
<tr><td class="en">reject / exercise / avoid + <b>นาม</b></td><td class="en">rejected authoritarian teaching methods (ข้อ 10)</td></tr>
<tr><td class="en">enjoy / avoid / finish / consider + <b>V-ing</b></td><td class="en">avoid getting cold</td></tr>
<tr><td class="en">บอกจุดประสงค์: <b>to + V1</b></td><td class="en">written especially to enable...</td></tr>
</tbody></table></div></div>

<div class="g"><h4>12. ประธาน-กริยาสอดคล้อง (Subject–verb agreement)</h4>
<p>ตัดส่วนขยายระหว่างประธานกับกริยาออก แล้วดูประธานจริง</p>
<p class="en">The <u>number</u> of enlistments ... <u>has</u> long been in dispute.<br>(the number of + นามพหูพจน์ → กริยาเอกพจน์ / a number of → กริยาพหูพจน์)</p></div>

<div class="g"><h4>13. ตัวเลขลำดับที่ และคำที่ใช้คู่กัน</h4>
<p class="en">✗ the twenty century → ✓ the <u>twentieth</u> century (ข้อ 18)<br>ranging from A to B · both A and B · either A or B · not only A but also B · so + adj + that</p></div>

<div class="g"><h4>14. คำคุณศัพท์อยู่หน้าคำนาม</h4>
<p class="en">✗ influence remarkable → ✓ <u>remarkable influence</u> (ข้อ 8)</p></div>
</div>`
    },
    {
      id: 'reading-tips',
      title: 'Reading: เคล็ดลับ',
      body: `
<h3>เคล็ดลับจากเอกสาร (แปล)</h3>
<ul>
<li>การอ่านภาษาอังกฤษ<b>ทุกวัน</b>คือหัวใจของความสำเร็จ โดยเฉพาะเนื้อหาวิชาการและการศึกษา เวลาอ่านให้ขีดเส้นใต้หรือจดคำที่ไม่รู้ทั้งหมด แล้วเปิดพจนานุกรม ระวังเลือกความหมายที่ตรงกับบริบทที่อ่านอยู่ จดชนิดของคำ (part of speech) ไว้ด้วย และหาคำในตระกูลเดียวกันที่เป็นชนิดอื่น</li>
<li>มีเวลา 55 นาทีสำหรับ 5 บทความ ควรคุมเวลาให้ใช้ประมาณ <b>10–11 นาทีต่อบท</b></li>
<li>แต่ละคนมีกลยุทธ์ต่างกัน ไม่มีวิธีที่ถูกหรือผิด ขอแค่ได้ผลกับตัวเอง
  <ul>
  <li><b>คนที่อ่านเร็ว:</b> อ่านบทความโดยละเอียดทั้งหมดก่อน แล้วตอบตั้งแต่ข้อแรก โดยรู้อยู่แล้วว่าข้อมูลอยู่ตรงไหน</li>
  <li><b>คนที่อ่านไม่เร็ว:</b> ทำข้อที่ "เร็ว" ก่อน คือข้อคำศัพท์ในบริบทกับข้อการอ้างอิงคำ ต่อด้วยข้อข้อเท็จจริง แล้วจึงทำข้อการอนุมานและใจความหลัก วิธีนี้จะได้อ่านบทความไปทีละส่วนจนเกือบครบ ก่อนถึงข้อที่ต้องเข้าใจทั้งเรื่อง</li>
  </ul></li>
<li>ไม่ว่าจะใช้วิธีไหน ผู้เขียนแนะนำให้ <b>skim</b> (อ่านผ่านๆ เร็วๆ) ทั้งบทตั้งแต่แรกก่อนเริ่มตอบ เพื่อจับหัวข้อและเนื้อหาคร่าวๆ</li>
</ul>
<h3>กลยุทธ์เพิ่มเติม</h3>
<ul>
<li>ประโยคแรกของแต่ละย่อหน้ามักเป็น topic sentence อ่านประโยคแรกทุกย่อหน้าก็จะได้ใจความหลักของบทความ</li>
<li>คำถามข้อเท็จจริงมักเรียงตามลำดับในบทความ ข้อ 2 มักอยู่ก่อนข้อ 3</li>
<li>ข้อ EXCEPT / NOT: หาให้เจอ 3 ตัวเลือกที่บทความกล่าวถึง ตัวที่เหลือคือคำตอบ</li>
<li>คำตอบที่ถูกมักถอดความ (paraphrase) จากบทความ ส่วนตัวเลือกที่ลอกคำจากบทความมาตรงๆ แต่ความหมายผิด เป็นตัวหลอกที่พบบ่อย</li>
<li>ระวังคำสุดโต่ง เช่น <span class="en">always, never, all, only, completely</span> ตัวเลือกแบบนี้มักผิด</li>
</ul>`
    },
    {
      id: 'question-types',
      title: 'Reading: ประเภทคำถาม',
      body: `
<p>คำถามใน Section 3 แบ่งได้ 6 ประเภท (แปลจากเอกสาร) พร้อมตัวอย่างจากข้อสอบชุดนี้</p>
<div class="gram">
<div class="g"><h4>1. ใจความหลัก (Main Idea)</h4>
<p>วัดว่าจับใจความสำคัญของบทความหรือของย่อหน้าได้หรือไม่ มักเป็นข้อแรกของบทความ และมีบทละ 1 ข้อ</p>
<p class="en">What does the passage mainly discuss? · The passage deals primarily with...</p>
<p class="tip">วิธีทำ: เลือกคำตอบที่ครอบคลุม<b>ทุกย่อหน้า</b> ตัวเลือกที่พูดถึงแค่ย่อหน้าเดียวมักเป็นตัวหลอก (Reading ข้อ 1, 12)</p></div>

<div class="g"><h4>2. ข้อเท็จจริง (Factual Information)</h4>
<p>ถามข้อมูลที่ระบุไว้ในบทความตรงๆ หาคำตอบได้จากเนื้อหาโดยตรง มักขึ้นต้นด้วยคำ WH หรือถามแบบปฏิเสธ (EXCEPT / NOT) มีบทละ 3–4 ข้อ</p>
<p class="en">According to the passage, which of the following statements about ... is true?<br>All of the following ... are described in the passage EXCEPT</p>
<p class="tip">วิธีทำ: หาคำสำคัญในคำถาม แล้วกวาดตาหาคำนั้นในบทความ (scan) อ่านเฉพาะประโยครอบๆ (ข้อ 2, 8, 9, 10, 14, 15)</p></div>

<div class="g"><h4>3. คำศัพท์ในบริบท (Vocabulary-in-Context)</h4>
<p>ถามความหมายของคำหรือวลีตาม<b>บริบทในบทความ</b> คำหนึ่งคำมีได้หลายความหมาย ต้องเลือกความหมายที่ใช้ในบทความ ไม่ใช่ความหมายที่เรารู้อยู่แล้ว มีบทละ 3–4 ข้อ</p>
<p class="en">The word "..." in line 9 is closest in meaning to</p>
<p class="tip">วิธีทำ: แทนตัวเลือกแต่ละตัวลงในประโยคแล้วดูว่าความหมายยังเหมือนเดิมไหม (ข้อ 6 scarce = limited, ข้อ 17 altered = changed)</p></div>

<div class="g"><h4>4. การอ้างอิงคำ (Referential Relationship)</h4>
<p>ถามว่าสรรพนาม คำนามนามธรรม หรือวลีในบทความหมายถึงอะไร มีบทละประมาณ 1 ข้อ</p>
<p class="en">What does the word "it" in line 27 refer to? · The phrase "this phenomenon" in line 8 refers to</p>
<p class="tip">วิธีทำ: ย้อนไปดูคำนามก่อนหน้าที่ตรงกันทั้งจำนวน (เอกพจน์/พหูพจน์) และความหมาย แล้วแทนลงไปเช็ก (ข้อ 3, 13, 18)</p></div>

<div class="g"><h4>5. การอนุมาน (Inference)</h4>
<p>วัดความสามารถในการสรุปจากสิ่งที่บทความบอก<b>โดยอ้อม</b> มีบทละ 1–2 ข้อ</p>
<p class="en">What can be inferred from the passage about...? · It can be concluded from the passage that</p>
<p class="tip">วิธีทำ: คำตอบไม่ได้เขียนไว้ตรงๆ แต่ต้องมีหลักฐานรองรับในบทความ อย่าใช้ความรู้ส่วนตัวตอบ (ข้อ 4, 16, 21)</p></div>

<div class="g"><h4>6. การเรียบเรียง ตรรกะ และจุดประสงค์ (Text Organization, Logic, and Purpose)</h4>
<p>วัดว่าเข้าใจการจัดเรียงข้อมูลในบทความและจุดประสงค์ที่ผู้เขียนกล่าวถึงบางสิ่งหรือไม่ อาจถามว่าเนื้อหาก่อนหรือหลังบทความน่าจะเป็นเรื่องอะไร มีบทละไม่เกิน 2 ข้อ</p>
<p class="en">The passage is developed and organized mainly by... · Why does the author mention ... in the fourth paragraph?</p>
<p class="tip">วิธีทำ: ถาม "ทำไม" ผู้เขียนยกตัวอย่างนี้ ส่วนใหญ่คำตอบคือ "เพื่อยกตัวอย่าง/สนับสนุน" ประเด็นก่อนหน้า (ข้อ 11, 19)</p></div>
</div>`
    },
    {
      id: 'vocab',
      title: 'คำศัพท์จากข้อสอบชุดนี้',
      body: `
<h3>Reading: บทความชนพื้นเมืองอเมริกัน</h3>
${vocab([
  ['adobe (n.)', 'อิฐดินตากแห้ง', 'sun-baked brick plastered with mud'],
  ['plaster (v.)', 'ฉาบ โบก', ''],
  ['quarters (n.)', 'ที่พักอาศัย', 'contained quarters for a thousand people'],
  ['storeroom (n.)', 'ห้องเก็บของ', ''],
  ['defense (n.)', 'การป้องกัน', 'for defense against enemies'],
  ['pottery (n.)', 'เครื่องปั้นดินเผา', ''],
  ['weave – wove – woven (v.)', 'สาน ทอ', 'wove marvelous baskets'],
  ['scarce (adj.)', 'ขาดแคลน มีจำกัด', '= limited, rare'],
  ['irrigation ditch (n.)', 'คูส่งน้ำเพื่อการเกษตร', ''],
  ['settled (adj.)', 'ตั้งถิ่นฐานถาวร', 'less-settled groups = กลุ่มที่ย้ายที่อยู่บ่อย'],
  ['wander (v.)', 'เร่ร่อน ท่องไป', ''],
  ['ancestor (n.)', 'บรรพบุรุษ', ''],
  ['hide (n.)', 'หนังสัตว์', 'its hide was used to make clothing'],
  ['tepee (n.)', 'กระโจมทรงกรวยของชนพื้นเมือง', ''],
])}
<h3>Reading: บทความความเค็มของน้ำทะเล</h3>
${vocab([
  ['salinity (n.)', 'ความเค็ม', 'saline (adj.) เค็ม'],
  ['vary (v.)', 'แตกต่าง ผันแปร', 'variation (n.), various (adj.)'],
  ['subtraction (n.)', 'การนำออก การลบ', ''],
  ['evaporation (n.)', 'การระเหย', 'evaporate (v.)'],
  ['conversion (n.)', 'การเปลี่ยนรูป', 'convert (v.)'],
  ['vapor (n.)', 'ไอ (น้ำ)', ''],
  ['precipitation (n.)', 'หยาดน้ำฟ้า เช่น ฝน หิมะ', ''],
  ['dilute (v.)', 'ทำให้เจือจาง', ''],
  ['runoff (n.)', 'น้ำที่ไหลบ่าลงแหล่งน้ำ', ''],
  ['alter (v.)', 'เปลี่ยนแปลง', '= change, modify'],
  ['dissolve (v.)', 'ละลาย', 'dissolved materials'],
  ['dense (adj.)', 'หนาแน่น', 'density (n.)'],
  ['sink (v.)', 'จม', ''],
])}
<h3>Listening & Structure</h3>
${vocab([
  ['lease (n.)', 'สัญญาเช่า', 'My lease is about to expire.'],
  ['expire (v.)', 'หมดอายุ', ''],
  ['listings (n.)', 'รายการ (เช่น ที่พักให้เช่า)', 'off-campus listings'],
  ['transfer (v.)', 'ย้าย (สถาบัน) / โอน (หน่วยกิต)', 'transferable (adj.)'],
  ['credits (n.)', 'หน่วยกิต', ''],
  ['registrar (n.)', 'นายทะเบียน', "registrar's office"],
  ['admissions (n.)', 'ฝ่ายรับเข้าศึกษา', ''],
  ['adviser / counselor (n.)', 'อาจารย์ที่ปรึกษา', ''],
  ['mineralogist (n.)', 'นักแร่วิทยา', ''],
  ['devise (v.)', 'คิดค้น ประดิษฐ์', ''],
  ['span (v.)', 'ครอบคลุม (ช่วง)', ''],
  ['classify (v.)', 'จัดประเภท', ''],
  ['coagulate (v.)', 'จับตัวเป็นก้อน', ''],
  ['invertebrate (n.)', 'สัตว์ไม่มีกระดูกสันหลัง', ''],
  ['inhibit (v.)', 'ยับยั้ง', ''],
  ['preservation (n.)', 'การถนอม การรักษา', ''],
  ['renowned (adj.)', 'มีชื่อเสียง', '= famous, well-known'],
  ['estuary (n.)', 'ปากแม่น้ำ', ''],
  ['enlistment (n.)', 'การสมัครเป็นทหาร', ''],
  ['in dispute', 'เป็นที่ถกเถียง', ''],
  ['authoritarian (adj.)', 'เผด็จการ เข้มงวด', ''],
])}`
    },
    {
      id: 'academic',
      title: 'ศัพท์วิชาการที่ออกบ่อย',
      body: `
<p>ข้อ Vocabulary-in-Context มักถามคำวิชาการและให้เลือก<b>คำพ้องความหมาย</b> ท่องเป็นคู่จะได้ผลที่สุด</p>
${vocab([
  ['abundant', 'มากมาย อุดมสมบูรณ์', '= plentiful, ample'],
  ['adjacent', 'อยู่ติดกัน', '= next to, neighboring'],
  ['approximately', 'ประมาณ', '= about, roughly'],
  ['crucial / vital', 'สำคัญมาก', '= essential, critical'],
  ['diminish', 'ลดลง', '= decrease, decline, dwindle'],
  ['durable', 'ทนทาน', '= long-lasting, sturdy'],
  ['emerge', 'ปรากฏ เกิดขึ้น', '= appear, arise'],
  ['enormous / immense / vast', 'ใหญ่มาก', '= huge, massive'],
  ['evident', 'ชัดเจน', '= obvious, apparent'],
  ['feasible', 'เป็นไปได้', '= possible, practical'],
  ['fragile', 'เปราะบาง', '= delicate, breakable'],
  ['hazardous', 'อันตราย', '= dangerous, risky'],
  ['inhabit', 'อาศัยอยู่', '= live in, occupy'],
  ['initial', 'แรกเริ่ม', '= first, original'],
  ['numerous', 'จำนวนมาก', '= many, countless'],
  ['obtain', 'ได้มา', '= get, acquire'],
  ['precise', 'แม่นยำ', '= exact, accurate'],
  ['primary / chief', 'หลัก', '= main, principal'],
  ['prominent', 'โดดเด่น มีชื่อเสียง', '= noticeable, well-known'],
  ['rigid', 'แข็ง ไม่ยืดหยุ่น', '= stiff, inflexible'],
  ['significant', 'สำคัญ มีนัยสำคัญ', '= important, considerable'],
  ['subsequent', 'ที่ตามมา', '= later, following'],
  ['sufficient', 'เพียงพอ', '= enough, adequate'],
  ['yield', 'ให้ผล ผลิต', '= produce, generate'],
  ['remarkable', 'น่าทึ่ง', '= extraordinary, notable'],
  ['gradually', 'ทีละน้อย', '= slowly, progressively'],
  ['consequently / thus', 'ดังนั้น', '= therefore, as a result'],
  ['nevertheless', 'อย่างไรก็ตาม', '= however, nonetheless'],
  ['similarly', 'ในทำนองเดียวกัน', '= likewise'],
])}
<h3>คำเชื่อมบอกทิศทางของบทความ</h3>
<div class="tbl"><table><tbody>
<tr><td>เพิ่มเติม</td><td class="en">moreover, furthermore, in addition, also</td></tr>
<tr><td>ขัดแย้ง</td><td class="en">however, nevertheless, on the other hand, whereas, although</td></tr>
<tr><td>เหตุผล / ผลลัพธ์</td><td class="en">because, since, thus, therefore, consequently, as a result</td></tr>
<tr><td>ยกตัวอย่าง</td><td class="en">for example, for instance, such as</td></tr>
<tr><td>เปรียบเทียบ</td><td class="en">similarly, likewise, in the same way</td></tr>
</tbody></table></div>`
    },
    {
      id: 'test-day',
      title: 'บริหารเวลา & วันสอบ',
      body: `
<div class="tbl"><table><thead><tr><th>Section</th><th>เวลาต่อข้อโดยประมาณ</th><th>เทคนิค</th></tr></thead><tbody>
<tr><td>Listening</td><td>~12 วินาที (ตามเสียง)</td><td>ตอบทันทีที่ได้ยินคำถาม แล้วรีบอ่านตัวเลือกข้อถัดไป</td></tr>
<tr><td>Structure</td><td>~30 วินาที</td><td>ข้อไหนเกิน 1 นาทีให้เดาไว้ก่อน ทำเครื่องหมายแล้วค่อยกลับมาดู</td></tr>
<tr><td>Reading</td><td>10–11 นาทีต่อบท (~1 นาทีต่อข้อ)</td><td>skim ก่อน ทำข้อง่ายก่อน อย่าติดอยู่ที่บทเดียว</td></tr>
</tbody></table></div>
<ul>
<li>ตอบผิดไม่หักคะแนน ต้องตอบให้ครบทุกข้อ ถ้าใกล้หมดเวลาให้รีบระบายข้อที่เหลือ</li>
<li>ข้อสอบจริงเป็นกระดาษคำตอบ ระบายให้ตรงข้อ และเช็กลำดับทุกๆ 10 ข้อว่าเลขข้อยังตรงกันอยู่</li>
<li>ห้ามจดลงในสมุดข้อสอบ ให้ฝึกจำคำสำคัญในหัวแทนการจด</li>
<li>ระหว่าง Listening ห้ามเปิดดู Section อื่น และเมื่อหมดเวลา Section ไหนแล้วจะย้อนกลับไปทำไม่ได้</li>
<li>ก่อนสอบ 1–2 สัปดาห์ ทำข้อสอบจำลองแบบจับเวลาจริงให้ครบทุก Section อย่างน้อย 2–3 ชุด เพื่อชินกับจังหวะ</li>
</ul>`
    },
  ];
})();
