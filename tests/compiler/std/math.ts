// based on http://nsz.repo.hu/git/?p=libc-test
// mostly generated from their tests using scripts/hexfloat.html

assert(Math.E == NativeMath.E); // global alias should exist

const INEXACT = 1 << 0;
const INVALID = 1 << 1;
const DIVBYZERO = 1 << 2;
const UNDERFLOW = 1 << 3;
const OVERFLOW = 1 << 4;

function check<T>(actual: T, expected: T, error: T, flags: i32): void { // TODO: is this correct? -0?
  if (isNaN(expected)) {
    if (!isNaN(actual)) unreachable();
  } else if (actual != expected) {
    if (!(flags & INEXACT) || abs<T>(actual - expected) > abs<T>(error)) unreachable();
  }
}

// ================================ built-in fmod ================================

function test_fmod(left: f64, right: f64, expected: f64, error: f64, flags: i32): void {
  check<f64>(left % right, expected, error, flags);
}

// sanity
test_fmod(-8.06684839057968084, 4.53566256067686879, -3.53118582990281205, 0.0, 0);
test_fmod(4.34523984933830487, -8.88799136300345083, 4.34523984933830487, 0.0, 0);
test_fmod(-8.38143342755524934, -2.76360733737958819, -0.0906114154164847641, 0.0, 0);
test_fmod(-6.53167358191348413, 4.56753527684274374, -1.96413830507074039, 0.0, 0);
test_fmod(9.26705696697258574, 4.81139208435979615, 4.45566488261278959, 0.0, 0);
test_fmod(-6.45004555606023633, 0.662071792337673881, -0.491399425021171399, 0.0, 0);
test_fmod(7.85889025304169664, 0.0521545267500622481, 0.0357112405323594256, 0.0, 0);
test_fmod(-0.792054511984895959, 7.67640268511753998, -0.792054511984895959, 0.0, 0);
test_fmod(0.615702673197924044, 2.01190257903248026, 0.615702673197924044, 0.0, 0);
test_fmod(-0.558758682360915193, 0.0322398306026380407, -0.0106815621160685006, 0.0, 0);

// special
test_fmod(0.0, 1.0, 0.0, 0.0, 0);
test_fmod(-0.0, 1.0, -0.0, 0.0, 0);
test_fmod(0.5, 1.0, 0.5, 0.0, 0);
test_fmod(-0.5, 1.0, -0.5, 0.0, 0);
test_fmod(1.0, 1.0, 0.0, 0.0, 0);
test_fmod(-1.0, 1.0, -0.0, 0.0, 0);
test_fmod(1.5, 1.0, 0.5, 0.0, 0);
test_fmod(-1.5, 1.0, -0.5, 0.0, 0);
test_fmod(2.0, 1.0, 0.0, 0.0, 0);
test_fmod(-2.0, 1.0, -0.0, 0.0, 0);
test_fmod(Infinity, 1.0, NaN, 0.0, INVALID);
test_fmod(-Infinity, 1.0, NaN, 0.0, INVALID);
test_fmod(NaN, 1.0, NaN, 0.0, 0);
test_fmod(0.0, -1.0, 0.0, 0.0, 0);
test_fmod(-0.0, -1.0, -0.0, 0.0, 0);
test_fmod(0.5, -1.0, 0.5, 0.0, 0);
test_fmod(-0.5, -1.0, -0.5, 0.0, 0);
test_fmod(1.0, -1.0, 0.0, 0.0, 0);
test_fmod(-1.0, -1.0, -0.0, 0.0, 0);
test_fmod(1.5, -1.0, 0.5, 0.0, 0);
test_fmod(-1.5, -1.0, -0.5, 0.0, 0);
test_fmod(2.0, -1.0, 0.0, 0.0, 0);
test_fmod(-2.0, -1.0, -0.0, 0.0, 0);
test_fmod(Infinity, -1.0, NaN, 0.0, INVALID);
test_fmod(-Infinity, -1.0, NaN, 0.0, INVALID);
test_fmod(NaN, -1.0, NaN, 0.0, 0);
test_fmod(0.0, 0.0, NaN, 0.0, INVALID);
test_fmod(0.0, -0.0, NaN, 0.0, INVALID);
test_fmod(0.0, Infinity, 0.0, 0.0, 0);
test_fmod(0.0, -Infinity, 0.0, 0.0, 0);
test_fmod(0.0, NaN, NaN, 0.0, 0);
test_fmod(-0.0, 0.0, NaN, 0.0, INVALID);
test_fmod(-0.0, -0.0, NaN, 0.0, INVALID);
test_fmod(-0.0, Infinity, -0.0, 0.0, 0);
test_fmod(-0.0, -Infinity, -0.0, 0.0, 0);
test_fmod(-0.0, NaN, NaN, 0.0, 0);
test_fmod(1.0, 0.0, NaN, 0.0, INVALID);
test_fmod(-1.0, 0.0, NaN, 0.0, INVALID);
test_fmod(Infinity, 0.0, NaN, 0.0, INVALID);
test_fmod(-Infinity, 0.0, NaN, 0.0, INVALID);
test_fmod(NaN, 0.0, NaN, 0.0, 0);
test_fmod(-1.0, -0.0, NaN, 0.0, INVALID);
test_fmod(Infinity, -0.0, NaN, 0.0, INVALID);
test_fmod(-Infinity, -0.0, NaN, 0.0, INVALID);
test_fmod(NaN, -0.0, NaN, 0.0, 0);
test_fmod(Infinity, 2.0, NaN, 0.0, INVALID);
test_fmod(Infinity, -0.5, NaN, 0.0, INVALID);
test_fmod(Infinity, NaN, NaN, 0.0, 0);
test_fmod(-Infinity, 2.0, NaN, 0.0, INVALID);
test_fmod(-Infinity, -0.5, NaN, 0.0, INVALID);
test_fmod(-Infinity, NaN, NaN, 0.0, 0);
test_fmod(NaN, NaN, NaN, 0.0, 0);
test_fmod(1.0, NaN, NaN, 0.0, 0);
test_fmod(-1.0, NaN, NaN, 0.0, 0);
test_fmod(1.0, Infinity, 1.0, 0.0, 0);
test_fmod(-1.0, Infinity, -1.0, 0.0, 0);
test_fmod(Infinity, Infinity, NaN, 0.0, INVALID);
test_fmod(-Infinity, Infinity, NaN, 0.0, INVALID);
test_fmod(1.0, -Infinity, 1.0, 0.0, 0);
test_fmod(-1.0, -Infinity, -1.0, 0.0, 0);
test_fmod(Infinity, -Infinity, NaN, 0.0, INVALID);
test_fmod(-Infinity, -Infinity, NaN, 0.0, INVALID);
test_fmod(1.75, 0.5, 0.25, 0.0, 0);
test_fmod(-1.75, 0.5, -0.25, 0.0, 0);
test_fmod(1.75, -0.5, 0.25, 0.0, 0);
test_fmod(-1.75, -0.5, -0.25, 0.0, 0);

// ================================ built-in fmodf ================================

function test_fmodf(left: f32, right: f32, expected: f32, error: f32, flags: i32): void {
  check<f32>(left % right, expected, error, flags);
}

// sanity
test_fmodf(-8.066848755, 4.535662651, -3.531186104, 0.0, 0);
test_fmodf(4.345239639, -8.887990952, 4.345239639, 0.0, 0);
test_fmodf(-8.381433487, -2.763607264, -0.09061169624, 0.0, 0);
test_fmodf(-6.531673431, 4.5675354, -1.964138031, 0.0, 0);
test_fmodf(9.267057419, 4.811392307, 4.455665112, 0.0, 0);
test_fmodf(-6.450045586, 0.6620717645, -0.4913997054, 0.0, 0);
test_fmodf(7.858890057, 0.05215452611, 0.03571113944, 0.0, 0);
test_fmodf(-0.7920545340, 7.676402569, -0.7920545340, 0.0, 0);
test_fmodf(0.6157026887, 2.011902571, 0.6157026887, 0.0, 0);
test_fmodf(-0.5587586761, 0.03223983198, -0.01068153232, 0.0, 0);

// special
test_fmodf(0.0, 1.0, 0.0, 0.0, 0);
test_fmodf(-0.0, 1.0, -0.0, 0.0, 0);
test_fmodf(0.5, 1.0, 0.5, 0.0, 0);
test_fmodf(-0.5, 1.0, -0.5, 0.0, 0);
test_fmodf(1.0, 1.0, 0.0, 0.0, 0);
test_fmodf(-1.0, 1.0, -0.0, 0.0, 0);
test_fmodf(1.5, 1.0, 0.5, 0.0, 0);
test_fmodf(-1.5, 1.0, -0.5, 0.0, 0);
test_fmodf(2.0, 1.0, 0.0, 0.0, 0);
test_fmodf(-2.0, 1.0, -0.0, 0.0, 0);
test_fmodf(Infinity, 1.0, NaN, 0.0, INVALID);
test_fmodf(-Infinity, 1.0, NaN, 0.0, INVALID);
test_fmodf(NaN, 1.0, NaN, 0.0, 0);
test_fmodf(0.0, -1.0, 0.0, 0.0, 0);
test_fmodf(-0.0, -1.0, -0.0, 0.0, 0);
test_fmodf(0.5, -1.0, 0.5, 0.0, 0);
test_fmodf(-0.5, -1.0, -0.5, 0.0, 0);
test_fmodf(1.0, -1.0, 0.0, 0.0, 0);
test_fmodf(-1.0, -1.0, -0.0, 0.0, 0);
test_fmodf(1.5, -1.0, 0.5, 0.0, 0);
test_fmodf(-1.5, -1.0, -0.5, 0.0, 0);
test_fmodf(2.0, -1.0, 0.0, 0.0, 0);
test_fmodf(-2.0, -1.0, -0.0, 0.0, 0);
test_fmodf(Infinity, -1.0, NaN, 0.0, INVALID);
test_fmodf(-Infinity, -1.0, NaN, 0.0, INVALID);
test_fmodf(NaN, -1.0, NaN, 0.0, 0);
test_fmodf(0.0, 0.0, NaN, 0.0, INVALID);
test_fmodf(0.0, -0.0, NaN, 0.0, INVALID);
test_fmodf(0.0, Infinity, 0.0, 0.0, 0);
test_fmodf(0.0, -Infinity, 0.0, 0.0, 0);
test_fmodf(0.0, NaN, NaN, 0.0, 0);
test_fmodf(-0.0, 0.0, NaN, 0.0, INVALID);
test_fmodf(-0.0, -0.0, NaN, 0.0, INVALID);
test_fmodf(-0.0, Infinity, -0.0, 0.0, 0);
test_fmodf(-0.0, -Infinity, -0.0, 0.0, 0);
test_fmodf(-0.0, NaN, NaN, 0.0, 0);
test_fmodf(1.0, 0.0, NaN, 0.0, INVALID);
test_fmodf(-1.0, 0.0, NaN, 0.0, INVALID);
test_fmodf(Infinity, 0.0, NaN, 0.0, INVALID);
test_fmodf(-Infinity, 0.0, NaN, 0.0, INVALID);
test_fmodf(NaN, 0.0, NaN, 0.0, 0);
test_fmodf(-1.0, -0.0, NaN, 0.0, INVALID);
test_fmodf(Infinity, -0.0, NaN, 0.0, INVALID);
test_fmodf(-Infinity, -0.0, NaN, 0.0, INVALID);
test_fmodf(NaN, -0.0, NaN, 0.0, 0);
test_fmodf(Infinity, 2.0, NaN, 0.0, INVALID);
test_fmodf(Infinity, -0.5, NaN, 0.0, INVALID);
test_fmodf(Infinity, NaN, NaN, 0.0, 0);
test_fmodf(-Infinity, 2.0, NaN, 0.0, INVALID);
test_fmodf(-Infinity, -0.5, NaN, 0.0, INVALID);
test_fmodf(-Infinity, NaN, NaN, 0.0, 0);
test_fmodf(NaN, NaN, NaN, 0.0, 0);
test_fmodf(1.0, NaN, NaN, 0.0, 0);
test_fmodf(-1.0, NaN, NaN, 0.0, 0);
test_fmodf(1.0, Infinity, 1.0, 0.0, 0);
test_fmodf(-1.0, Infinity, -1.0, 0.0, 0);
test_fmodf(Infinity, Infinity, NaN, 0.0, INVALID);
test_fmodf(-Infinity, Infinity, NaN, 0.0, INVALID);
test_fmodf(1.0, -Infinity, 1.0, 0.0, 0);
test_fmodf(-1.0, -Infinity, -1.0, 0.0, 0);
test_fmodf(Infinity, -Infinity, NaN, 0.0, INVALID);
test_fmodf(-Infinity, -Infinity, NaN, 0.0, INVALID);
test_fmodf(1.75, 0.5, 0.25, 0.0, 0);
test_fmodf(-1.75, 0.5, -0.25, 0.0, 0);
test_fmodf(1.75, -0.5, 0.25, 0.0, 0);
test_fmodf(-1.75, -0.5, -0.25, 0.0, 0);

// ================================ Math.log ================================

function test_log(value: f64, expected: f64, error: f64, flags: i32): void {
  check<f64>(NativeMath.log(value), expected, error, flags);
  check<f64>(JSMath.log(value), expected, error, flags);
}

// sanity
test_log(-8.06684839057968084, NaN, 0.0, INVALID);
test_log(4.34523984933830487, 1.46908095842243225, -0.341253340244293213, INEXACT);
test_log(-8.38143342755524934, NaN, 0.0, INVALID);
test_log(-6.53167358191348413, NaN, 0.0, INVALID);
test_log(9.26705696697258574, 2.22646584987956153, 0.363811403512954712, INEXACT);
test_log(0.661985898099504477, -0.412511025236513673, -0.291087478399276733, INEXACT);
test_log(-0.406603922385355310, NaN, 0.0, INVALID);
test_log(0.561759746220724110, -0.576681018319586181, -0.109831996262073517, INEXACT);
test_log(0.774152296591303690, -0.255986659126386518, -0.0579900443553924561, INEXACT);
test_log(-0.678763702639402444, NaN, 0.0, INVALID);

// special
test_log(0.0, -Infinity, 0.0, DIVBYZERO);
test_log(-0.0, -Infinity, 0.0, DIVBYZERO);
test_log(-7.88860905221011805e-31, NaN, 0.0, INVALID);
test_log(1.0, 0.0, 0.0, 0);
test_log(-1.0, NaN, 0.0, INVALID);
test_log(Infinity, Infinity, 0.0, 0);
test_log(-Infinity, NaN, 0.0, INVALID);
test_log(NaN, NaN, 0.0, 0);

// ================================ Mathf.log ================================

function test_logf(value: f32, expected: f32, error: f32, flags: i32): void {
  check<f32>(NativeMathf.log(value), expected, error, flags);
}

// sanity
test_logf(0.0, -Infinity, 0.0, DIVBYZERO);
test_logf(-0.0, -Infinity, 0.0, DIVBYZERO);
test_logf(-7.888609052e-31, NaN, 0.0, INVALID);
test_logf(1.0, 0.0, 0.0, 0);
test_logf(-1.0, NaN, 0.0, INVALID);
test_logf(Infinity, Infinity, 0.0, 0);
test_logf(-Infinity, NaN, 0.0, INVALID);
test_logf(NaN, NaN, 0.0, 0);

// special
test_logf(0.0, -Infinity, 0.0, DIVBYZERO);
test_logf(-0.0, -Infinity, 0.0, DIVBYZERO);
test_logf(-7.888609052e-31, NaN, 0.0, INVALID);
test_logf(1.0, 0.0, 0.0, 0);
test_logf(-1.0, NaN, 0.0, INVALID);
test_logf(Infinity, Infinity, 0.0, 0);
test_logf(-Infinity, NaN, 0.0, INVALID);
test_logf(NaN, NaN, 0.0, 0);

// ================================ Math.exp ================================

function test_exp(value: f64, expected: f64, error: f64, flags: i32): void {
  check<f64>(NativeMath.exp(value), expected, error, flags);
  check<f64>(JSMath.exp(value), expected, error, flags);
}

// sanity
test_exp(-8.06684839057968084, 0.000313770606816174511, -0.259919732809066772, INEXACT);
test_exp(4.34523984933830487, 77.1105301711214111, -0.0279267579317092896, INEXACT);
test_exp(-8.38143342755524934, 0.000229081338491632304, -0.249743342399597168, INEXACT);
test_exp(-6.53167358191348413, 0.00145656612609315877, -0.481682240962982178, INEXACT);
test_exp(9.26705696697258574, 10583.5582455249933, 0.176967620849609375, INEXACT);
test_exp(0.661985898099504477, 1.93863845255719980, -0.496424645185470581, INEXACT);
test_exp(-0.406603922385355310, 0.665907889283802512, -0.106083184480667114, INEXACT);
test_exp(0.561759746220724110, 1.75375595186263111, -0.391621112823486328, INEXACT);
test_exp(0.774152296591303690, 2.16875288851292458, -0.299612581729888916, INEXACT);
test_exp(-0.678763702639402444, 0.507243708940284255, 0.472617387771606445, INEXACT);

// special
test_exp(0.0, 1.0, 0.0, 0);
test_exp(-0.0, 1.0, 0.0, 0);
test_exp(1.0, 2.71828182845904509, -0.325530737638473511, INEXACT);
test_exp(-1.0, 0.367879441171442334, 0.223896518349647522, INEXACT);
test_exp(Infinity, Infinity, 0.0, 0);
test_exp(-Infinity, 0.0, 0.0, 0);
test_exp(NaN, NaN, 0.0, 0);
test_exp(1.03972148895263650, 2.82842915587641119, 0.188030809164047241, INEXACT);
test_exp(-1.03972148895263650, 0.353553136702178472, 0.252727240324020386, INEXACT);
test_exp(1.03972101211547852, 2.82842780717661224, -0.418413937091827393, INEXACT);
test_exp(1.03972148895263672, 2.82842915587641164, -0.226183772087097168, INEXACT);

// ================================ Mathf.exp ================================

function test_expf(value: f32, expected: f32, error: f32, flags: i32): void {
  check<f32>(NativeMathf.exp(value), expected, error, flags);
}

// sanity
test_expf(-8.066848755, 0.0003137704916, -0.03019333631, INEXACT);
test_expf(4.345239639, 77.11051178, -0.2875460684, INEXACT);
test_expf(-8.381433487, 0.0002290813281, 0.2237040401, INEXACT);
test_expf(-6.531673431, 0.001456566388, 0.3646970391, INEXACT);
test_expf(9.267057419, 10583.56348, 0.4596210420, INEXACT);
test_expf(0.6619858742, 1.938638449, 0.3568260968, INEXACT);
test_expf(-0.4066039324, 0.6659078598, -0.3829499185, INEXACT);
test_expf(0.5617597699, 1.753756046, 0.4435549080, INEXACT);
test_expf(0.7741522789, 2.168752909, 0.2456246912, INEXACT);
test_expf(-0.6787636876, 0.5072436929, -0.3974292278, INEXACT);

// special
test_expf(0.0, 1.0, 0.0, 0);
test_expf(-0.0, 1.0, 0.0, 0);
test_expf(1.0, 2.718281746, -0.3462330997, INEXACT);
test_expf(-1.0, 0.3678794503, 0.3070148528, INEXACT);
test_expf(Infinity, Infinity, 0.0, 0);
test_expf(-Infinity, 0.0, 0.0, 0);
test_expf(NaN, NaN, 0.0, 0);
test_expf(88.72283173, 3.402798519e+38, -0.09067153931, INEXACT);
test_expf(88.72283936, Infinity, 0.0, INEXACT|OVERFLOW);
test_expf(-103.9720764, 1.401298464e-45, 0.4999996722, INEXACT|UNDERFLOW);
test_expf(-103.9720840, 0.0, -0.4999965131, INEXACT|UNDERFLOW);
test_expf(0.3465735614, 1.414213538, 0.1392242163, INEXACT);
test_expf(0.3465735912, 1.414213538, -0.2143291682, INEXACT);
test_expf(0.3465736210, 1.414213657, 0.4321174324, INEXACT);

// ================================ Math.pow ================================

function test_pow(left: f64, right: f64, expected: f64, error: f64, flags: i32): void {
  check<f64>(NativeMath.pow(left, right), expected, error, flags);
}

// sanity
test_pow(-8.06684839057968084, 4.53566256067686879, NaN, 0.0, INVALID);
test_pow(4.34523984933830487, -8.88799136300345083, 0.00000213471188255872853, 0.325016021728515625, INEXACT);
test_pow(-8.38143342755524934, -2.76360733737958819, NaN, 0.0, INVALID);
test_pow(-6.53167358191348413, 4.56753527684274374, NaN, 0.0, INVALID);
test_pow(9.26705696697258574, 4.81139208435979615, 44909.2994151296589, -0.266590803861618042, INEXACT);
test_pow(-6.45004555606023633, 0.662071792337673881, NaN, 0.0, INVALID);
test_pow(7.85889025304169664, 0.0521545267500622481, 1.11351774134586523, -0.371686071157455444, INEXACT);
test_pow(-0.792054511984895959, 7.67640268511753998, NaN, 0.0, INVALID);
test_pow(0.615702673197924044, 2.01190257903248026, 0.376907735213801831, 0.324733018875122070, INEXACT);
test_pow(-0.558758682360915193, 0.0322398306026380407, NaN, 0.0, INVALID);
// special
test_pow(0.0, NaN, NaN, 0.0, 0);
test_pow(0.0, Infinity, 0.0, 0.0, 0);
test_pow(0.0, 3.0, 0.0, 0.0, 0);
test_pow(0.0, 2.0, 0.0, 0.0, 0);
test_pow(0.0, 1.0, 0.0, 0.0, 0);
test_pow(0.0, 0.5, 0.0, 0.0, 0);
test_pow(0.0, 0.0, 1.0, 0.0, 0);
test_pow(0.0, -0.0, 1.0, 0.0, 0);
test_pow(0.0, -0.5, Infinity, 0.0, DIVBYZERO);
test_pow(0.0, -1.0, Infinity, 0.0, DIVBYZERO);
test_pow(0.0, -2.0, Infinity, 0.0, DIVBYZERO);
test_pow(0.0, -3.0, Infinity, 0.0, DIVBYZERO);
test_pow(0.0, -4.0, Infinity, 0.0, DIVBYZERO);
test_pow(0.0, -Infinity, Infinity, 0.0, 0);
test_pow(-0.0, NaN, NaN, 0.0, 0);
test_pow(-0.0, Infinity, 0.0, 0.0, 0);
test_pow(-0.0, 3.0, -0.0, 0.0, 0);
test_pow(-0.0, 2.0, 0.0, 0.0, 0);
test_pow(-0.0, 1.0, -0.0, 0.0, 0);
test_pow(-0.0, 0.5, 0.0, 0.0, 0);
test_pow(-0.0, 0.0, 1.0, 0.0, 0);
test_pow(-0.0, -0.0, 1.0, 0.0, 0);
test_pow(-0.0, -0.5, Infinity, 0.0, DIVBYZERO);
test_pow(-0.0, -1.0, -Infinity, 0.0, DIVBYZERO);
test_pow(-0.0, -2.0, Infinity, 0.0, DIVBYZERO);
test_pow(-0.0, -3.0, -Infinity, 0.0, DIVBYZERO);
test_pow(-0.0, -4.0, Infinity, 0.0, DIVBYZERO);
test_pow(-0.0, -Infinity, Infinity, 0.0, 0);
test_pow(NaN, 0.0, 1.0, 0.0, 0);
test_pow(Infinity, 0.0, 1.0, 0.0, 0);
test_pow(-Infinity, 0.0, 1.0, 0.0, 0);
test_pow(1.0, 0.0, 1.0, 0.0, 0);
test_pow(-1.0, 0.0, 1.0, 0.0, 0);
test_pow(-0.5, 0.0, 1.0, 0.0, 0);
test_pow(NaN, -0.0, 1.0, 0.0, 0);
test_pow(Infinity, -0.0, 1.0, 0.0, 0);
test_pow(-Infinity, -0.0, 1.0, 0.0, 0);
test_pow(1.0, -0.0, 1.0, 0.0, 0);
test_pow(-1.0, -0.0, 1.0, 0.0, 0);
test_pow(-0.5, -0.0, 1.0, 0.0, 0);
test_pow(-1.0, NaN, NaN, 0.0, 0);
test_pow(-1.0, Infinity, 1.0, 0.0, 0);
test_pow(-1.0, -Infinity, 1.0, 0.0, 0);
test_pow(-1.0, 2.0, 1.0, 0.0, 0);
test_pow(-1.0, -1.0, -1.0, 0.0, 0);
test_pow(-1.0, -2.0, 1.0, 0.0, 0);
test_pow(-1.0, -3.0, -1.0, 0.0, 0);
test_pow(-1.0, 0.5, NaN, 0.0, INVALID);
test_pow(1.0, NaN, 1.0, 0.0, 0);
test_pow(1.0, Infinity, 1.0, 0.0, 0);
test_pow(1.0, -Infinity, 1.0, 0.0, 0);
test_pow(1.0, 3.0, 1.0, 0.0, 0);
test_pow(1.0, 0.5, 1.0, 0.0, 0);
test_pow(1.0, -0.5, 1.0, 0.0, 0);
test_pow(1.0, -3.0, 1.0, 0.0, 0);
test_pow(-0.5, 0.5, NaN, 0.0, INVALID);
test_pow(-0.5, 1.5, NaN, 0.0, INVALID);
test_pow(-0.5, 2.0, 0.25, 0.0, 0);
test_pow(-0.5, 3.0, -0.125, 0.0, 0);
test_pow(-0.5, Infinity, 0.0, 0.0, 0);
test_pow(-0.5, -Infinity, Infinity, 0.0, 0);
test_pow(-0.5, NaN, NaN, 0.0, 0);
test_pow(0.5, Infinity, 0.0, 0.0, 0);
test_pow(0.5, -Infinity, Infinity, 0.0, 0);
test_pow(0.5, NaN, NaN, 0.0, 0);
test_pow(1.5, Infinity, Infinity, 0.0, 0);
test_pow(1.5, -Infinity, 0.0, 0.0, 0);
test_pow(1.5, NaN, NaN, 0.0, 0);
test_pow(Infinity, NaN, NaN, 0.0, 0);
test_pow(Infinity, Infinity, Infinity, 0.0, 0);
test_pow(Infinity, -Infinity, 0.0, 0.0, 0);
test_pow(Infinity, 3.0, Infinity, 0.0, 0);
test_pow(Infinity, 2.0, Infinity, 0.0, 0);
test_pow(Infinity, 1.0, Infinity, 0.0, 0);
test_pow(Infinity, 0.5, Infinity, 0.0, 0);
test_pow(Infinity, -0.5, 0.0, 0.0, 0);
test_pow(Infinity, -1.0, 0.0, 0.0, 0);
test_pow(Infinity, -2.0, 0.0, 0.0, 0);
test_pow(-Infinity, NaN, NaN, 0.0, 0);
test_pow(-Infinity, Infinity, Infinity, 0.0, 0);
test_pow(-Infinity, -Infinity, 0.0, 0.0, 0);
test_pow(-Infinity, 3.0, -Infinity, 0.0, 0);
test_pow(-Infinity, 2.0, Infinity, 0.0, 0);
test_pow(-Infinity, 1.0, -Infinity, 0.0, 0);
test_pow(-Infinity, 0.5, Infinity, 0.0, 0);
test_pow(-Infinity, -0.5, 0.0, 0.0, 0);
test_pow(-Infinity, -1.0, -0.0, 0.0, 0);
test_pow(-Infinity, -2.0, 0.0, 0.0, 0);
test_pow(NaN, 1.0, NaN, 0.0, 0);
test_pow(NaN, -1.0, NaN, 0.0, 0);
test_pow(-2.0, 1.0, -2.0, 0.0, 0);
test_pow(-2.0, -1.0, -0.5, 0.0, 0);

// ================================ Mathf.pow ================================

function test_powf(left: f32, right: f32, expected: f32, error: f32, flags: i32): void {
  check<f32>(NativeMathf.pow(left, right), expected, error, flags);
}

// sanity
test_powf(-8.066848755, 4.535662651, NaN, 0.0, INVALID);
test_powf(4.345239639, -8.887990952, 0.000002134714123, 0.1436440796, INEXACT);
test_powf(-8.381433487, -2.763607264, NaN, 0.0, INVALID);
test_powf(-6.531673431, 4.567535400, NaN, 0.0, INVALID);
test_powf(9.267057419, 4.811392307, 44909.33203, -0.05356409028, INEXACT);
test_powf(-6.450045586, 0.6620717645, NaN, 0.0, INVALID);
test_powf(7.858890057, 0.05215452611, 1.113517761, 0.1912208945, INEXACT);
test_powf(-0.7920545340, 7.676402569, NaN, 0.0, INVALID);
test_powf(0.6157026887, 2.011902571, 0.3769077659, 0.3371490538, INEXACT);
test_powf(-0.5587586761, 0.03223983198, NaN, 0.0, INVALID);
// special
test_powf(0.0, NaN, NaN, 0.0, 0);
test_powf(0.0, Infinity, 0.0, 0.0, 0);
test_powf(0.0, 3.0, 0.0, 0.0, 0);
test_powf(0.0, 2.0, 0.0, 0.0, 0);
test_powf(0.0, 1.0, 0.0, 0.0, 0);
test_powf(0.0, 0.5, 0.0, 0.0, 0);
test_powf(0.0, 0.0, 1.0, 0.0, 0);
test_powf(0.0, -0.0, 1.0, 0.0, 0);
test_powf(0.0, -0.5, Infinity, 0.0, DIVBYZERO);
test_powf(0.0, -1.0, Infinity, 0.0, DIVBYZERO);
test_powf(0.0, -2.0, Infinity, 0.0, DIVBYZERO);
test_powf(0.0, -3.0, Infinity, 0.0, DIVBYZERO);
test_powf(0.0, -4.0, Infinity, 0.0, DIVBYZERO);
test_powf(0.0, -Infinity, Infinity, 0.0, 0);
test_powf(-0.0, NaN, NaN, 0.0, 0);
test_powf(-0.0, Infinity, 0.0, 0.0, 0);
test_powf(-0.0, 3.0, -0.0, 0.0, 0);
test_powf(-0.0, 2.0, 0.0, 0.0, 0);
test_powf(-0.0, 1.0, -0.0, 0.0, 0);
test_powf(-0.0, 0.5, 0.0, 0.0, 0);
test_powf(-0.0, 0.0, 1.0, 0.0, 0);
test_powf(-0.0, -0.0, 1.0, 0.0, 0);
test_powf(-0.0, -0.5, Infinity, 0.0, DIVBYZERO);
test_powf(-0.0, -1.0, -Infinity, 0.0, DIVBYZERO);
test_powf(-0.0, -2.0, Infinity, 0.0, DIVBYZERO);
test_powf(-0.0, -3.0, -Infinity, 0.0, DIVBYZERO);
test_powf(-0.0, -4.0, Infinity, 0.0, DIVBYZERO);
test_powf(-0.0, -Infinity, Infinity, 0.0, 0);
test_powf(NaN, 0.0, 1.0, 0.0, 0);
test_powf(Infinity, 0.0, 1.0, 0.0, 0);
test_powf(-Infinity, 0.0, 1.0, 0.0, 0);
test_powf(1.0, 0.0, 1.0, 0.0, 0);
test_powf(-1.0, 0.0, 1.0, 0.0, 0);
test_powf(-0.5, 0.0, 1.0, 0.0, 0);
test_powf(NaN, -0.0, 1.0, 0.0, 0);
test_powf(Infinity, -0.0, 1.0, 0.0, 0);
test_powf(-Infinity, -0.0, 1.0, 0.0, 0);
test_powf(1.0, -0.0, 1.0, 0.0, 0);
test_powf(-1.0, -0.0, 1.0, 0.0, 0);
test_powf(-0.5, -0.0, 1.0, 0.0, 0);
test_powf(-1.0, NaN, NaN, 0.0, 0);
test_powf(-1.0, Infinity, 1.0, 0.0, 0);
test_powf(-1.0, -Infinity, 1.0, 0.0, 0);
test_powf(-1.0, 2.0, 1.0, 0.0, 0);
test_powf(-1.0, -1.0, -1.0, 0.0, 0);
test_powf(-1.0, -2.0, 1.0, 0.0, 0);
test_powf(-1.0, -3.0, -1.0, 0.0, 0);
test_powf(-1.0, 0.5, NaN, 0.0, INVALID);
test_powf(1.0, NaN, 1.0, 0.0, 0);
test_powf(1.0, Infinity, 1.0, 0.0, 0);
test_powf(1.0, -Infinity, 1.0, 0.0, 0);
test_powf(1.0, 3.0, 1.0, 0.0, 0);
test_powf(1.0, 0.5, 1.0, 0.0, 0);
test_powf(1.0, -0.5, 1.0, 0.0, 0);
test_powf(1.0, -3.0, 1.0, 0.0, 0);
test_powf(-0.5, 0.5, NaN, 0.0, INVALID);
test_powf(-0.5, 1.5, NaN, 0.0, INVALID);
test_powf(-0.5, 2.0, 0.25, 0.0, 0);
test_powf(-0.5, 3.0, -0.125, 0.0, 0);
test_powf(-0.5, Infinity, 0.0, 0.0, 0);
test_powf(-0.5, -Infinity, Infinity, 0.0, 0);
test_powf(-0.5, NaN, NaN, 0.0, 0);
test_powf(0.5, Infinity, 0.0, 0.0, 0);
test_powf(0.5, -Infinity, Infinity, 0.0, 0);
test_powf(0.5, NaN, NaN, 0.0, 0);
test_powf(1.5, Infinity, Infinity, 0.0, 0);
test_powf(1.5, -Infinity, 0.0, 0.0, 0);
test_powf(1.5, NaN, NaN, 0.0, 0);
test_powf(Infinity, NaN, NaN, 0.0, 0);
test_powf(Infinity, Infinity, Infinity, 0.0, 0);
test_powf(Infinity, -Infinity, 0.0, 0.0, 0);
test_powf(Infinity, 3.0, Infinity, 0.0, 0);
test_powf(Infinity, 2.0, Infinity, 0.0, 0);
test_powf(Infinity, 1.0, Infinity, 0.0, 0);
test_powf(Infinity, 0.5, Infinity, 0.0, 0);
test_powf(Infinity, -0.5, 0.0, 0.0, 0);
test_powf(Infinity, -1.0, 0.0, 0.0, 0);
test_powf(Infinity, -2.0, 0.0, 0.0, 0);
test_powf(-Infinity, NaN, NaN, 0.0, 0);
test_powf(-Infinity, Infinity, Infinity, 0.0, 0);
test_powf(-Infinity, -Infinity, 0.0, 0.0, 0);
test_powf(-Infinity, 3.0, -Infinity, 0.0, 0);
test_powf(-Infinity, 2.0, Infinity, 0.0, 0);
test_powf(-Infinity, 1.0, -Infinity, 0.0, 0);
test_powf(-Infinity, 0.5, Infinity, 0.0, 0);
test_powf(-Infinity, -0.5, 0.0, 0.0, 0);
test_powf(-Infinity, -1.0, -0.0, 0.0, 0);
test_powf(-Infinity, -2.0, 0.0, 0.0, 0);
test_powf(NaN, 1.0, NaN, 0.0, 0);
test_powf(NaN, -1.0, NaN, 0.0, 0);
test_powf(-2.0, 1.0, -2.0, 0.0, 0);
test_powf(-2.0, -1.0, -0.5, 0.0, 0);

// ================================ Math.cbrt ================================

function test_cbrt(value: f64, expected: f64, error: f64, flags: i32): void {
  check<f64>(NativeMath.cbrt(value), expected, error, flags);
  check<f64>(JSMath.cbrt(value), expected, error, flags);
}

// sanity
test_cbrt(-8.06684839057968084, -2.00555525450202454, 0.466679513454437256, INEXACT);
test_cbrt(4.34523984933830487, 1.63181624105156353, -0.0816027149558067322, INEXACT);
test_cbrt(-8.38143342755524934, -2.03129391067336096, -0.0481018163263797760, INEXACT);
test_cbrt(-6.53167358191348413, -1.86928200122049248, 0.0862401872873306274, INEXACT);
test_cbrt(9.26705696697258574, 2.10045772085970217, -0.272298902273178101, INEXACT);
test_cbrt(0.661985898099504477, 0.871531147045597310, 0.441491812467575073, INEXACT);
test_cbrt(-0.406603922385355310, -0.740839030300223023, 0.0164538137614727020, INEXACT);
test_cbrt(0.561759746220724110, 0.825119540055928580, 0.306806385517120361, INEXACT);
test_cbrt(0.774152296591303690, 0.918210247895991372, 0.0654399842023849487, INEXACT);
test_cbrt(-0.678763702639402444, -0.878832690658009397, -0.201671317219734192, INEXACT);

// special
test_cbrt(NaN, NaN, 0.0, 0);
test_cbrt(Infinity, Infinity, 0.0, 0);
test_cbrt(-Infinity, -Infinity, 0.0, 0);
test_cbrt(0.0, 0.0, 0.0, 0);
test_cbrt(-0.0, -0.0, 0.0, 0);
test_cbrt(9.31322574615478516e-10, 0.0009765625, 0.0, 0);
test_cbrt(-9.31322574615478516e-10, -0.0009765625, 0.0, 0);
test_cbrt(1.0, 1.0, 0.0, 0);
test_cbrt(-1.0, -1.0, 0.0, 0);
test_cbrt(8.0, 2.0, 0.0, 0);

// ================================ Mathf.cbrt ================================

function test_cbrtf(value: f32, expected: f32, error: f32, flags: i32): void {
  check<f32>(NativeMathf.cbrt(value), expected, error, flags);
}

// sanity
test_cbrtf(-8.066848755, -2.005555391, -0.4471924007, INEXACT);
test_cbrtf(4.345239639, 1.631816268, 0.4463625252, INEXACT);
test_cbrtf(-8.381433487, -2.031293869, 0.1948342621, INEXACT);
test_cbrtf(-6.531673431, -1.869282007, -0.1707551479, INEXACT);
test_cbrtf(9.267057419, 2.100457668, -0.3636204302, INEXACT);
test_cbrtf(0.6619858742, 0.8715311289, -0.1285720915, INEXACT);
test_cbrtf(-0.4066039324, -0.7408390641, -0.4655757546, INEXACT);
test_cbrtf(0.5617597699, 0.8251195550, 0.05601907894, INEXACT);
test_cbrtf(0.7741522789, 0.9182102680, 0.4549820423, INEXACT);
test_cbrtf(-0.6787636876, -0.8788326979, -0.2297896743, INEXACT);

// special
test_cbrtf(NaN, NaN, 0.0, 0);
test_cbrtf(Infinity, Infinity, 0.0, 0);
test_cbrtf(-Infinity, -Infinity, 0.0, 0);
test_cbrtf(0.0, 0.0, 0.0, 0);
test_cbrtf(-0.0, -0.0, 0.0, 0);
test_cbrtf(9.313225746e-10, 0.0009765625, 0.0, 0);
test_cbrtf(-9.313225746e-10, -0.0009765625, 0.0, 0);
test_cbrtf(1.0, 1.0, 0.0, 0);
test_cbrtf(-1.0, -1.0, 0.0, 0);
test_cbrtf(8.0, 2.0, 0.0, 0);

// ================================ Mathf.random ================================

NativeMath.seedRandom(reinterpret<u64>(JSMath.random()));
for (let i = 0; i < 1e7; ++i) {
  let r = NativeMath.random();
  assert(r >= 0.0 && r < 1.0);
}