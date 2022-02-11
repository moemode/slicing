J$.iids = {"8":[6,25,6,29],"9":[3,13,3,14],"10":[4,16,4,23],"16":[6,13,6,19],"17":[3,13,3,14],"18":[4,30,4,31],"24":[4,16,4,23],"25":[3,13,3,14],"26":[5,14,5,15],"32":[9,8,9,14],"33":[4,13,4,14],"34":[6,13,6,19],"41":[4,13,4,14],"42":[9,8,9,14],"49":[4,16,4,17],"57":[4,20,4,23],"65":[4,30,4,31],"73":[4,25,4,26],"81":[4,25,4,31],"89":[5,14,5,15],"97":[5,9,5,10],"105":[5,9,5,15],"113":[5,9,5,16],"121":[6,13,6,14],"129":[6,18,6,19],"137":[6,25,6,29],"145":[9,8,9,9],"153":[9,13,9,14],"161":[10,12,10,22],"169":[10,12,10,22],"177":[10,9,10,23],"185":[12,13,12,18],"193":[12,13,12,18],"201":[12,9,12,19],"209":[14,12,14,13],"217":[14,12,14,13],"225":[14,5,14,14],"233":[1,1,15,2],"241":[1,1,15,2],"249":[1,1,15,2],"257":[1,1,15,2],"265":[1,1,15,2],"273":[16,1,16,8],"281":[16,1,16,10],"289":[16,1,16,11],"297":[1,1,16,11],"305":[1,1,15,2],"313":[1,1,16,11],"321":[6,21,7,19],"329":[6,9,7,19],"337":[4,5,8,6],"345":[4,5,8,6],"353":[4,5,8,6],"361":[9,5,13,6],"369":[1,1,15,2],"377":[1,1,15,2],"385":[1,1,16,11],"393":[1,1,16,11],"nBranches":8,"originalCodeFileName":"/home/v/slicing/testcases/mine/preproc_reportExample_in.js","instrumentedCodeFileName":"/home/v/slicing/testcases/mine/preproc_reportExample_in_jalangi_.js","code":"function sliceMe() {\n    var c, r;\n    var s = 5;\n    for(c = 1; c < 100; c += 2) {\n        s += c;\n        if (c == 1) if (true)\n            break;\n    }\n    if(s == 6) {\n        r= \"good job\";\n    } else {\n        r = \"bad\";\n    }\n    return r; //sc\n}\nsliceMe();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(297, '/home/v/slicing/testcases/mine/preproc_reportExample_in_jalangi_.js', '/home/v/slicing/testcases/mine/preproc_reportExample_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(233, arguments.callee, this, arguments);
                            arguments = J$.N(241, 'arguments', arguments, 4);
                            J$.N(249, 'c', c, 0);
                            J$.N(257, 'r', r, 0);
                            J$.N(265, 's', s, 0);
                            var c, r;
                            var s = J$.X1(25, J$.W(17, 's', J$.T(9, 5, 22, false), s, 1));
                            for (J$.X1(345, c = J$.W(41, 'c', J$.T(33, 1, 22, false), c, 0)); J$.X1(337, J$.C(24, J$.B(10, '<', J$.R(49, 'c', c, 0), J$.T(57, 100, 22, false), 0))); J$.X1(353, c = J$.W(81, 'c', J$.B(18, '+', J$.R(73, 'c', c, 0), J$.T(65, 2, 22, false), 0), c, 0))) {
                                J$.X1(113, s = J$.W(105, 's', J$.B(26, '+', J$.R(97, 's', s, 0), J$.R(89, 'c', c, 0), 0), s, 0));
                                if (J$.X1(329, J$.C(16, J$.B(34, '==', J$.R(121, 'c', c, 0), J$.T(129, 1, 22, false), 0))))
                                    if (J$.X1(321, J$.C(8, J$.T(137, true, 23, false))))
                                    break;
                            }
                            if (J$.X1(361, J$.C(32, J$.B(42, '==', J$.R(145, 's', s, 0), J$.T(153, 6, 22, false), 0)))) {
                                J$.X1(177, r = J$.W(169, 'r', J$.T(161, "good job", 21, false), r, 0));
                            } else {
                                J$.X1(201, r = J$.W(193, 'r', J$.T(185, "bad", 21, false), r, 0));
                            }
                            return J$.X1(225, J$.Rt(217, J$.R(209, 'r', r, 0)));
                        } catch (J$e) {
                            J$.Ex(369, J$e);
                        } finally {
                            if (J$.Fr(377))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(313, 'sliceMe', J$.T(305, sliceMe, 12, false, 233), 0);
            J$.X1(289, J$.F(281, J$.R(273, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(385, J$e);
        } finally {
            if (J$.Sr(393)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
