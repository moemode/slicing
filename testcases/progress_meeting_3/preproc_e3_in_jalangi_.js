J$.iids = {"8":[12,17,12,21],"9":[3,13,3,14],"10":[5,15,5,19],"16":[6,12,6,17],"17":[3,13,3,14],"18":[5,20,5,23],"24":[5,15,5,19],"25":[3,13,3,14],"32":[16,9,16,13],"33":[4,13,4,14],"34":[5,20,5,23],"41":[4,13,4,14],"42":[6,12,6,17],"49":[4,13,4,14],"50":[7,16,7,17],"57":[5,13,5,14],"58":[10,16,10,17],"65":[5,13,5,14],"66":[16,9,16,13],"73":[5,15,5,16],"74":[17,13,17,18],"81":[5,17,5,19],"97":[5,20,5,21],"105":[5,20,5,23],"121":[6,12,6,13],"129":[6,16,6,17],"137":[7,16,7,17],"145":[7,13,7,14],"153":[7,13,7,17],"161":[7,13,7,18],"169":[10,16,10,17],"177":[10,13,10,14],"185":[10,13,10,17],"193":[10,13,10,18],"201":[12,17,12,21],"209":[16,9,16,10],"217":[16,11,16,13],"225":[17,13,17,14],"233":[17,17,17,18],"241":[17,13,17,18],"249":[17,9,17,19],"257":[19,12,19,13],"265":[19,12,19,13],"273":[19,5,19,14],"281":[1,1,20,2],"289":[1,1,20,2],"297":[1,1,20,2],"305":[1,1,20,2],"313":[1,1,20,2],"321":[22,1,22,8],"329":[22,1,22,10],"337":[22,1,22,11],"345":[1,1,23,20],"353":[1,1,20,2],"361":[1,1,23,20],"369":[12,13,13,23],"377":[6,9,14,10],"385":[5,5,15,6],"393":[5,5,15,6],"401":[5,5,15,6],"409":[16,5,18,6],"417":[1,1,20,2],"425":[1,1,20,2],"433":[1,1,23,20],"441":[1,1,23,20],"nBranches":8,"originalCodeFileName":"/home/v/coding/slicing/testcases/progress_meeting_3/preproc_e3_in.js","instrumentedCodeFileName":"/home/v/coding/slicing/testcases/progress_meeting_3/preproc_e3_in_jalangi_.js","code":"function sliceMe() {\n    var x;\n    var y = 0;\n    var z = 0;\n    for(x = 0;x<10;x++){\n        if(x < 5){\n            y+=x;\n        }\n        else{\n            z+=1;\n\n            if (true)\n                break;\n        }\n    }    \n    if (y>11){\n        z = y + y;    \n    }    \n    return z;\n}\n\nsliceMe();\n//criteria: line 17"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(345, '/home/v/coding/slicing/testcases/progress_meeting_3/preproc_e3_in_jalangi_.js', '/home/v/coding/slicing/testcases/progress_meeting_3/preproc_e3_in.js');
            function sliceMe() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(281, arguments.callee, this, arguments);
                            arguments = J$.N(289, 'arguments', arguments, 4);
                            J$.N(297, 'x', x, 0);
                            J$.N(305, 'y', y, 0);
                            J$.N(313, 'z', z, 0);
                            var x;
                            var y = J$.X1(25, J$.W(17, 'y', J$.T(9, 0, 22, false), y, 1));
                            var z = J$.X1(49, J$.W(41, 'z', J$.T(33, 0, 22, false), z, 1));
                            for (J$.X1(393, x = J$.W(65, 'x', J$.T(57, 0, 22, false), x, 0)); J$.X1(385, J$.C(24, J$.B(10, '<', J$.R(73, 'x', x, 0), J$.T(81, 10, 22, false), 0))); J$.X1(401, J$.B(34, '-', x = J$.W(105, 'x', J$.B(26, '+', J$.U(18, '+', J$.R(97, 'x', x, 0)), J$.T(89, 1, 22, false), 0), x, 0), J$.T(113, 1, 22, false), 0))) {
                                if (J$.X1(377, J$.C(16, J$.B(42, '<', J$.R(121, 'x', x, 0), J$.T(129, 5, 22, false), 0)))) {
                                    J$.X1(161, y = J$.W(153, 'y', J$.B(50, '+', J$.R(145, 'y', y, 0), J$.R(137, 'x', x, 0), 0), y, 0));
                                } else {
                                    J$.X1(193, z = J$.W(185, 'z', J$.B(58, '+', J$.R(177, 'z', z, 0), J$.T(169, 1, 22, false), 0), z, 0));
                                    if (J$.X1(369, J$.C(8, J$.T(201, true, 23, false))))
                                        break;
                                }
                            }
                            if (J$.X1(409, J$.C(32, J$.B(66, '>', J$.R(209, 'y', y, 0), J$.T(217, 11, 22, false), 0)))) {
                                J$.X1(249, z = J$.W(241, 'z', J$.B(74, '+', J$.R(225, 'y', y, 0), J$.R(233, 'y', y, 0), 0), z, 0));
                            }
                            return J$.X1(273, J$.Rt(265, J$.R(257, 'z', z, 0)));
                        } catch (J$e) {
                            J$.Ex(417, J$e);
                        } finally {
                            if (J$.Fr(425))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            sliceMe = J$.N(361, 'sliceMe', J$.T(353, sliceMe, 12, false, 281), 0);
            J$.X1(337, J$.F(329, J$.R(321, 'sliceMe', sliceMe, 1), 0)());
        } catch (J$e) {
            J$.Ex(433, J$e);
        } finally {
            if (J$.Sr(441)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
