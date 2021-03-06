(module
 (type $iiiiv (func (param i32 i32 i32 i32)))
 (type $FF (func (param f64) (result f64)))
 (import "JSMath" "sqrt" (func $~lib/math/JSMath.sqrt (param f64) (result f64)))
 (import "JSMath" "log" (func $~lib/math/JSMath.log (param f64) (result f64)))
 (import "JSMath" "LN2" (global $~lib/math/JSMath.LN2 f64))
 (import "env" "memory" (memory $0 1))
 (export "computeLine" (func $assembly/index/computeLine))
 (export "memory" (memory $0))
 (func $assembly/index/computeLine (; 2 ;) (type $iiiiv) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 f64)
  (local $5 f64)
  (local $6 i32)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  (local $10 f64)
  (local $11 f64)
  (local $12 f64)
  ;;@ assembly/index.ts:8:2
  (set_local $11
   ;;@ assembly/index.ts:8:19
   (f64.div
    (f64.convert_u/i32
     (get_local $1)
    )
    ;;@ assembly/index.ts:8:27
    (f64.const 1.6)
   )
  )
  ;;@ assembly/index.ts:11:2
  (set_local $9
   ;;@ assembly/index.ts:11:18
   (f64.mul
    (f64.sub
     (f64.convert_u/i32
      ;;@ assembly/index.ts:11:19
      (get_local $0)
     )
     ;;@ assembly/index.ts:9:19
     (f64.div
      (f64.convert_u/i32
       (get_local $2)
      )
      ;;@ assembly/index.ts:9:28
      (f64.const 2)
     )
    )
    ;;@ assembly/index.ts:10:2
    (tee_local $12
     ;;@ assembly/index.ts:10:14
     (f64.div
      (f64.const 10)
      ;;@ assembly/index.ts:10:21
      (f64.min
       ;;@ assembly/index.ts:10:25
       (f64.mul
        (f64.const 3)
        (f64.convert_u/i32
         ;;@ assembly/index.ts:10:29
         (get_local $1)
        )
       )
       ;;@ assembly/index.ts:10:36
       (f64.mul
        (f64.const 4)
        (f64.convert_u/i32
         ;;@ assembly/index.ts:10:40
         (get_local $2)
        )
       )
      )
     )
    )
   )
  )
  ;;@ assembly/index.ts:12:7
  (set_local $2
   ;;@ assembly/index.ts:12:20
   (i32.const 0)
  )
  (loop $continue|0
   (if
    ;;@ assembly/index.ts:12:23
    (i32.lt_u
     (get_local $2)
     ;;@ assembly/index.ts:12:27
     (get_local $1)
    )
    (block
     ;;@ assembly/index.ts:13:4
     (set_local $10
      ;;@ assembly/index.ts:13:15
      (f64.mul
       (f64.sub
        (f64.convert_u/i32
         ;;@ assembly/index.ts:13:16
         (get_local $2)
        )
        ;;@ assembly/index.ts:13:20
        (get_local $11)
       )
       ;;@ assembly/index.ts:13:34
       (get_local $12)
      )
     )
     (set_local $4
      ;;@ assembly/index.ts:16:13
      (f64.const 0)
     )
     (set_local $5
      ;;@ assembly/index.ts:16:23
      (f64.const 0)
     )
     ;;@ assembly/index.ts:17:4
     (set_local $6
      ;;@ assembly/index.ts:17:25
      (i32.const 0)
     )
     ;;@ assembly/index.ts:18:4
     (block $break|1
      (loop $continue|1
       (if
        ;;@ assembly/index.ts:18:11
        (f64.le
         (f64.add
          (tee_local $8
           ;;@ assembly/index.ts:18:19
           (f64.mul
            (get_local $4)
            ;;@ assembly/index.ts:18:24
            (get_local $4)
           )
          )
          ;;@ assembly/index.ts:18:30
          (tee_local $7
           ;;@ assembly/index.ts:18:38
           (f64.mul
            (get_local $5)
            ;;@ assembly/index.ts:18:43
            (get_local $5)
           )
          )
         )
         ;;@ assembly/index.ts:18:50
         (f64.const 4)
        )
        (block
         ;;@ assembly/index.ts:20:6
         (set_local $5
          ;;@ assembly/index.ts:20:11
          (f64.add
           (f64.mul
            (f64.mul
             (f64.const 2)
             ;;@ assembly/index.ts:20:17
             (get_local $4)
            )
            ;;@ assembly/index.ts:20:22
            (get_local $5)
           )
           ;;@ assembly/index.ts:20:27
           (get_local $9)
          )
         )
         ;;@ assembly/index.ts:21:6
         (set_local $4
          ;;@ assembly/index.ts:19:18
          (f64.add
           (f64.sub
            (get_local $8)
            ;;@ assembly/index.ts:19:25
            (get_local $7)
           )
           ;;@ assembly/index.ts:19:32
           (get_local $10)
          )
         )
         ;;@ assembly/index.ts:22:30
         (br_if $break|1
          ;;@ assembly/index.ts:22:10
          (i32.ge_u
           (get_local $6)
           ;;@ assembly/index.ts:22:23
           (get_local $3)
          )
         )
         ;;@ assembly/index.ts:23:6
         (set_local $6
          (i32.add
           ;;@ assembly/index.ts:23:8
           (get_local $6)
           (i32.const 1)
          )
         )
         (br $continue|1)
        )
       )
      )
     )
     ;;@ assembly/index.ts:27:9
     (set_local $8
      ;;@ assembly/index.ts:27:29
      (f64.min
       ;;@ assembly/index.ts:27:33
       (f64.const 8)
       ;;@ assembly/index.ts:27:36
       (f64.convert_u/i32
        (get_local $3)
       )
      )
     )
     (loop $continue|2
      (if
       ;;@ assembly/index.ts:27:44
       (f64.lt
        (f64.convert_u/i32
         (get_local $6)
        )
        ;;@ assembly/index.ts:27:56
        (get_local $8)
       )
       (block
        ;;@ assembly/index.ts:28:6
        (set_local $7
         ;;@ assembly/index.ts:28:18
         (f64.add
          (f64.sub
           (f64.mul
            (get_local $4)
            ;;@ assembly/index.ts:28:23
            (get_local $4)
           )
           ;;@ assembly/index.ts:28:28
           (f64.mul
            (get_local $5)
            ;;@ assembly/index.ts:28:33
            (get_local $5)
           )
          )
          ;;@ assembly/index.ts:28:38
          (get_local $10)
         )
        )
        ;;@ assembly/index.ts:29:6
        (set_local $5
         ;;@ assembly/index.ts:29:11
         (f64.add
          (f64.mul
           (f64.mul
            (f64.const 2)
            ;;@ assembly/index.ts:29:17
            (get_local $4)
           )
           ;;@ assembly/index.ts:29:22
           (get_local $5)
          )
          ;;@ assembly/index.ts:29:27
          (get_local $9)
         )
        )
        ;;@ assembly/index.ts:30:6
        (set_local $4
         ;;@ assembly/index.ts:30:11
         (get_local $7)
        )
        ;;@ assembly/index.ts:27:71
        (set_local $6
         (i32.add
          ;;@ assembly/index.ts:27:73
          (get_local $6)
          (i32.const 1)
         )
        )
        (br $continue|2)
       )
      )
     )
     ;;@ assembly/index.ts:40:4
     (i32.store16
      ;;@ assembly/index.ts:40:15
      (i32.shl
       (i32.add
        ;;@ assembly/index.ts:40:16
        (i32.mul
         (get_local $0)
         ;;@ assembly/index.ts:40:20
         (get_local $1)
        )
        ;;@ assembly/index.ts:40:28
        (get_local $2)
       )
       ;;@ assembly/index.ts:40:34
       (i32.const 1)
      )
      ;;@ assembly/index.ts:37:15
      (if (result i32)
       (f64.eq
        (f64.sub
         (tee_local $7
          ;;@ assembly/index.ts:36:4
          (tee_local $8
           ;;@ assembly/index.ts:36:15
           (f64.div
            ;;@ assembly/index.ts:36:20
            (call $~lib/math/JSMath.log
             ;;@ assembly/index.ts:36:29
             (call $~lib/math/JSMath.log
              ;;@ assembly/index.ts:36:38
              (call $~lib/math/JSMath.sqrt
               ;;@ assembly/index.ts:36:43
               (f64.add
                (f64.mul
                 (get_local $4)
                 ;;@ assembly/index.ts:36:48
                 (get_local $4)
                )
                ;;@ assembly/index.ts:36:53
                (f64.mul
                 (get_local $5)
                 ;;@ assembly/index.ts:36:58
                 (get_local $5)
                )
               )
              )
             )
            )
            ;;@ assembly/index.ts:36:66
            (get_global $~lib/math/JSMath.LN2)
           )
          )
         )
         (get_local $7)
        )
        (f64.const 0)
       )
       ;;@ assembly/index.ts:38:8
       (i32.trunc_u/f64
        ;;@ assembly/index.ts:38:14
        (f64.mul
         (f64.const 2047)
         (f64.min
          (f64.max
           (tee_local $7
            ;;@ assembly/index.ts:38:39
            (f64.div
             (f64.sub
              (f64.convert_u/i32
               ;;@ assembly/index.ts:38:40
               (i32.add
                (get_local $6)
                ;;@ assembly/index.ts:38:52
                (i32.const 1)
               )
              )
              ;;@ assembly/index.ts:38:56
              (get_local $8)
             )
             (f64.convert_u/i32
              ;;@ assembly/index.ts:38:64
              (get_local $3)
             )
            )
           )
           (f64.const 0)
          )
          (f64.const 1)
         )
        )
       )
       ;;@ assembly/index.ts:39:8
       (i32.const 2047)
      )
     )
     ;;@ assembly/index.ts:12:34
     (set_local $2
      (i32.add
       ;;@ assembly/index.ts:12:36
       (get_local $2)
       (i32.const 1)
      )
     )
     (br $continue|0)
    )
   )
  )
 )
)
