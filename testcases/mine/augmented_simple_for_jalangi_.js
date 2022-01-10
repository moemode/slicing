J$.iids = {"8":[3,13,3,19],"9":[2,14,2,15],"10":[2,17,2,22],"16":[6,13,6,19],"17":[2,14,2,15],"18":[2,24,2,27],"24":[2,17,2,22],"25":[2,17,2,18],"33":[2,21,2,22],"34":[2,24,2,27],"42":[3,13,3,19],"49":[2,24,2,25],"50":[6,13,6,19],"57":[2,24,2,27],"73":[3,13,3,14],"81":[3,18,3,19],"89":[4,17,4,18],"97":[4,17,4,18],"105":[4,13,4,19],"113":[6,13,6,14],"121":[6,18,6,19],"129":[7,17,7,18],"137":[7,17,7,18],"145":[7,13,7,19],"153":[10,12,10,13],"161":[10,12,10,13],"169":[10,5,10,14],"177":[1,1,11,2],"185":[1,1,11,2],"193":[13,1,13,8],"201":[13,1,13,10],"209":[13,1,13,11],"217":[1,1,13,11],"225":[1,1,11,2],"233":[1,1,13,11],"241":[3,9,5,10],"249":[6,9,8,10],"257":[2,5,9,6],"265":[2,5,9,6],"273":[2,5,9,6],"281":[1,1,11,2],"289":[1,1,11,2],"297":[1,1,13,11],"305":[1,1,13,11],"nBranches":6,"originalCodeFileName":"/home/v/slicing/testcases/mine/augmented_simple_for.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/augmented_simple_for_jalangi_.js","code":"function sliceMe() {\n    for (i = 0; i < 5; i++) {\n        if (i == 3) {\n            x = 5;\n        }\n        if (i == 4) {\n            x = 6;\n        }\n    }\n    return x;\n}\n\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(217, '/home/v/slicing/testcases/mine/augmented_simple_for_jalangi_.js', '/home/v/slicing/testcases/mine/augmented_simple_for.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(177, arguments.callee, this, arguments);
                            arguments = J$.N(185, 'arguments', arguments, 4);
                            for (J$.X1(265, i = J$.W(17, 'i', J$.T(9, 0, 22, false), J$.I(typeof i === 'undefined' ? undefined : i), 4)); J$.X1(257, J$.C(24, J$.B(10, '<', J$.R(25, 'i', i, 2), J$.T(33, 5, 22, false), 0))); J$.X1(273, J$.B(34, '-', i = J$.W(57, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(49, 'i', i, 2)), J$.T(41, 1, 22, false), 0), J$.I(typeof i === 'undefined' ? undefined : i), 4), J$.T(65, 1, 22, false), 0))) {
                                if (J$.X1(241, J$.C(8, J$.B(42, '==', J$.R(73, 'i', i, 2), J$.T(81, 3, 22, false), 0)))) {
                                    J$.X1(105, x = J$.W(97, 'x', J$.T(89, 5, 22, false), J$.I(typeof x === 'undefined' ? undefined : x), 4));
                                }
                                if (J$.X1(249, J$.C(16, J$.B(50, '==', J$.R(113, 'i', i, 2), J$.T(121, 4, 22, false), 0)))) {
                                    J$.X1(145, x = J$.W(137, 'x', J$.T(129, 6, 22, false), J$.I(typeof x === 'undefined' ? undefined : x), 4));
                                }
                            }
                            return J$.X1(169, J$.Rt(161, J$.R(153, 'x', x, 2)));
                        } catch (J$e) {
                            J$.Ex(281, J$e);
                        } finally {
                            if (J$.Fr(289))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(233, 'sliceMe', J$.T(225, sliceMe, 12, false, 177), 0);
            J$.X1(209, J$.F(201, J$.R(193, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(297, J$e);
        } finally {
            if (J$.Sr(305)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
