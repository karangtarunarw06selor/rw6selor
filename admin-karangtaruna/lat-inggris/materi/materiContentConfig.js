


export const MATERI_CONTENT = {
    pos: {
        title: "Parts of Speech",
        description: "Parts of Speech adalah kelompok jenis kata dalam Bahasa Inggris. Setiap kata memiliki fungsi tertentu dalam kalimat, seperti menunjukkan orang/benda, aksi, sifat, keterangan, hubungan, atau penghubung.",

        formula: `
            <strong>Inti Materi:</strong><br>
            Sentence = Subject + Verb + Object/Complement/Adverb
        `,

        notes: [
            "Noun digunakan untuk menyebut orang, tempat, benda, atau ide.",
            "Pronoun digunakan untuk menggantikan noun.",
            "Verb menunjukkan aksi atau keadaan.",
            "Adjective menjelaskan noun.",
            "Adverb menjelaskan verb, adjective, atau adverb lain.",
            "Preposition menunjukkan hubungan tempat, waktu, atau arah.",
            "Conjunction menghubungkan kata, frasa, atau klausa.",
            "Interjection menunjukkan ekspresi singkat."
        ],

        patterns: [
            {
                group: "Kelas Kata Utama",
                items: [
                    {
                        label: "Noun",
                        formula: "Noun = person / place / thing / idea",
                        examples: [
                            "Rina reads a book.",
                            "Bandung is a beautiful city.",
                            "Happiness is important."
                        ]
                    },
                    {
                        label: "Pronoun",
                        formula: "Pronoun = I, you, he, she, it, we, they",
                        examples: [
                            "She is my sister.",
                            "They are students.",
                            "It is expensive."
                        ]
                    },
                    {
                        label: "Verb",
                        formula: "Verb = action / state",
                        examples: [
                            "He studies English.",
                            "They play football.",
                            "I am happy."
                        ]
                    },
                    {
                        label: "Adjective",
                        formula: "Adjective = describes noun",
                        examples: [
                            "She has a beautiful bag.",
                            "This is an easy lesson.",
                            "He is a smart student."
                        ]
                    }
                ]
            },
            {
                group: "Kelas Kata Pendukung",
                items: [
                    {
                        label: "Adverb",
                        formula: "Adverb = describes verb / adjective / adverb",
                        examples: [
                            "He runs quickly.",
                            "She is very kind.",
                            "They speak English well."
                        ]
                    },
                    {
                        label: "Preposition",
                        formula: "Preposition = in, on, at, under, beside, from, to",
                        examples: [
                            "The book is on the table.",
                            "I live in Indonesia.",
                            "She goes to school."
                        ]
                    },
                    {
                        label: "Conjunction",
                        formula: "Conjunction = and, but, because, or, so",
                        examples: [
                            "I like tea and coffee.",
                            "He is tired but happy.",
                            "She studies because she has a test."
                        ]
                    },
                    {
                        label: "Interjection",
                        formula: "Interjection = short expression",
                        examples: [
                            "Wow! That is amazing.",
                            "Oops! I made a mistake.",
                            "Hey! Listen to me."
                        ]
                    }
                ]
            }
        ],

        quiz: [
            {
                question: "Kata mana yang merupakan noun?",
                options: ["Run", "Beautiful", "School", "Quickly"],
                answer: "School"
            },
            {
                question: "Kata mana yang merupakan verb?",
                options: ["Eat", "Happy", "Table", "Blue"],
                answer: "Eat"
            },
            {
                question: "Kalimat mana yang mengandung adjective?",
                options: [
                    "She runs.",
                    "He has a red car.",
                    "They eat rice.",
                    "I go home."
                ],
                answer: "He has a red car."
            },

            {
                question: "Kata mana yang merupakan pronoun?",
                options: ["Teacher", "Beautiful", "They", "Quickly"],
                answer: "They"
            },
            {
                question: "Kata mana yang merupakan adjective?",
                options: ["Blue", "Run", "School", "Slowly"],
                answer: "Blue"
            },
            {
                question: "Kata mana yang merupakan adverb?",
                options: ["Quickly", "Book", "Happy", "Teacher"],
                answer: "Quickly"
            },
            {
                question: "Kata mana yang merupakan preposition?",
                options: ["Because", "Under", "Wow", "Run"],
                answer: "Under"
            },
            {
                question: "Kata mana yang merupakan conjunction?",
                options: ["Beautiful", "And", "Quickly", "Table"],
                answer: "And"
            },
            {
                question: "Kata mana yang merupakan interjection?",
                options: ["Wow!", "Teacher", "Blue", "Run"],
                answer: "Wow!"
            },
            {
                question: "Kalimat mana yang mengandung pronoun?",
                options: [
                            "The teacher is kind.",
                            "She is kind.",
                            "The book is new.",
                            "My school is big."
                        ],
                answer: "She is kind."
}
        ]
    },

    noun: {
    title: "Noun",
    description: "Noun adalah kata yang digunakan untuk menyebut orang, tempat, benda, hewan, atau ide. Dalam kalimat, noun sering berfungsi sebagai subject, object, atau complement.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Noun = Person / Place / Thing / Animal / Idea
    `,

    notes: [
        "Noun dapat menjadi subject dalam kalimat.",
        "Noun dapat menjadi object setelah verb.",
        "Common noun adalah noun umum seperti student, city, school.",
        "Proper noun adalah nama khusus seperti Rina, Bandung, Indonesia.",
        "Countable noun dapat dihitung, misalnya book, chair, student.",
        "Uncountable noun tidak dihitung satuan langsung, misalnya water, rice, money.",
        "Singular noun berarti satu benda.",
        "Plural noun berarti lebih dari satu benda."
    ],

    patterns: [
        {
            group: "Fungsi Noun",
            items: [
                {
                    label: "Subject",
                    formula: "Noun + Verb + Object/Complement",
                    examples: [
                        "The student reads a book.",
                        "My father works every day.",
                        "Bandung is a beautiful city."
                    ]
                },
                {
                    label: "Object",
                    formula: "Subject + Verb + Noun",
                    examples: [
                        "She buys a bag.",
                        "They play football.",
                        "I drink water."
                    ]
                },
                {
                    label: "Complement",
                    formula: "Subject + to be + Noun",
                    examples: [
                        "He is a teacher.",
                        "She is my sister.",
                        "They are students."
                    ]
                }
            ]
        },
        {
            group: "Jenis Noun",
            items: [
                {
                    label: "Common Noun",
                    formula: "Common Noun = nama umum",
                    examples: [
                        "student",
                        "school",
                        "city"
                    ]
                },
                {
                    label: "Proper Noun",
                    formula: "Proper Noun = nama khusus",
                    examples: [
                        "Rina",
                        "Jakarta",
                        "Indonesia"
                    ]
                },
                {
                    label: "Countable Noun",
                    formula: "Countable Noun = bisa dihitung",
                    examples: [
                        "one book",
                        "two chairs",
                        "three students"
                    ]
                },
                {
                    label: "Uncountable Noun",
                    formula: "Uncountable Noun = tidak dihitung satuan langsung",
                    examples: [
                        "water",
                        "rice",
                        "money"
                    ]
                }
            ]
        },
        {
            group: "Jumlah Noun",
            items: [
                {
                    label: "Singular",
                    formula: "Singular Noun = satu",
                    examples: [
                        "one book",
                        "a student",
                        "an apple"
                    ]
                },
                {
                    label: "Plural",
                    formula: "Plural Noun = lebih dari satu",
                    examples: [
                        "two books",
                        "many students",
                        "three apples"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Function",
            question: "Dari kalimat berikut, yang manakah noun: 'The student reads a book'?",
            options: ["Reads", "Student", "The", "A"],
            answer: "Student",
            explanation: "Student adalah noun karena menyebut orang."
        },
        {
            type: "Function",
            question: "Dari kalimat berikut, yang manakah object noun: 'She buys a bag'?",
            options: ["She", "Buys", "Bag", "A"],
            answer: "Bag",
            explanation: "Bag adalah object noun karena menjadi benda yang dibeli."
        },
        {
            type: "Type",
            question: "Kata mana yang merupakan proper noun?",
            options: ["city", "teacher", "Jakarta", "school"],
            answer: "Jakarta",
            explanation: "Jakarta adalah proper noun karena nama khusus tempat."
        },
        {
            type: "Type",
            question: "Kata mana yang merupakan common noun?",
            options: ["Indonesia", "Rina", "student", "Bandung"],
            answer: "student",
            explanation: "Student adalah common noun karena nama umum."
        },
        {
            type: "Count",
            question: "Manakah yang merupakan countable noun?",
            options: ["water", "rice", "book", "money"],
            answer: "book",
            explanation: "Book bisa dihitung: one book, two books."
        },
        {
            type: "Count",
            question: "Manakah yang merupakan uncountable noun?",
            options: ["chair", "student", "water", "apple"],
            answer: "water",
            explanation: "Water tidak dihitung langsung sebagai one water, two waters dalam penggunaan umum."
        },
        {
            type: "Number",
            question: "Pilih bentuk jamak (plural) dari 'book'.",
            options: ["book", "books", "bookes", "bookies"],
            answer: "books",
            explanation: "Plural regular noun biasanya ditambah -s."
        },
        {
            type: "Number",
            question: "Pilih bentuk jamak (plural) dari 'child'.",
            options: ["childs", "childes", "children", "childrens"],
            answer: "children",
            explanation: "Child memiliki bentuk plural tidak beraturan: children."
        },
        {
            type: "Article",
            question: "Frasa (phrase) mana yang paling tepat?",
            options: ["a apple", "an apple", "a apples", "an books"],
            answer: "an apple",
            explanation: "Gunakan 'an' sebelum bunyi vokal seperti apple."
        },
        {
            type: "Meaning",
            question: "Manakah yang merupakan idea?",
            options: ["happiness", "table", "school", "cat"],
            answer: "happiness",
            explanation: "Happiness adalah abstract noun karena menyebut ide/perasaan."
        }
    ]
},

pronoun: {
    title: "Pronoun",
    description: "Pronoun adalah kata yang digunakan untuk menggantikan noun agar kalimat tidak terdengar berulang. Pronoun dapat menggantikan nama orang, benda, hewan, tempat, atau kelompok.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Noun → Pronoun<br>
        Rina → She<br>
        Budi → He<br>
        The cat → It<br>
        Rina and Budi → They
    `,

    notes: [
        "Pronoun digunakan untuk menggantikan noun.",
        "Subject pronoun digunakan sebagai pelaku dalam kalimat.",
        "Object pronoun digunakan sebagai objek setelah verb atau preposition.",
        "Possessive adjective digunakan untuk menunjukkan kepemilikan sebelum noun.",
        "Possessive pronoun digunakan untuk menunjukkan kepemilikan tanpa noun setelahnya.",
        "Reflexive pronoun digunakan saat subject dan object merujuk pada orang yang sama.",
        "Jangan menggunakan noun dan pronoun sekaligus untuk subject yang sama."
    ],

    patterns: [
        {
            group: "Subject Pronoun",
            items: [
                {
                    label: "I / You / We / They",
                    formula: "Subject Pronoun + Verb + Object/Complement",
                    examples: [
                        "I study English.",
                        "You are my friend.",
                        "We play football.",
                        "They live in Bandung."
                    ]
                },
                {
                    label: "He / She / It",
                    formula: "He/She/It + Verb(s/es) + Object/Complement",
                    examples: [
                        "He studies English.",
                        "She reads a book.",
                        "It sleeps under the table."
                    ]
                }
            ]
        },
        {
            group: "Object Pronoun",
            items: [
                {
                    label: "Me / You / Us / Them",
                    formula: "Subject + Verb + Object Pronoun",
                    examples: [
                        "She helps me.",
                        "I know you.",
                        "He teaches us.",
                        "We meet them."
                    ]
                },
                {
                    label: "Him / Her / It",
                    formula: "Subject + Verb + him/her/it",
                    examples: [
                        "I call him.",
                        "They know her.",
                        "She likes it."
                    ]
                }
            ]
        },
        {
            group: "Possessive",
            items: [
                {
                    label: "Possessive Adjective",
                    formula: "my/your/his/her/its/our/their + Noun",
                    examples: [
                        "This is my book.",
                        "That is your bag.",
                        "His house is big.",
                        "Their school is clean."
                    ]
                },
                {
                    label: "Possessive Pronoun",
                    formula: "mine/yours/his/hers/ours/theirs",
                    examples: [
                        "This book is mine.",
                        "That bag is yours.",
                        "The red car is hers.",
                        "This classroom is ours."
                    ]
                }
            ]
        },
        {
            group: "Reflexive Pronoun",
            items: [
                {
                    label: "Singular",
                    formula: "myself / yourself / himself / herself / itself",
                    examples: [
                        "I do it myself.",
                        "He teaches himself.",
                        "She looks at herself."
                    ]
                },
                {
                    label: "Plural",
                    formula: "ourselves / yourselves / themselves",
                    examples: [
                        "We prepare ourselves.",
                        "You must help yourselves.",
                        "They introduce themselves."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Subject",
            question: "Pronoun mana yang bisa menggantikan 'Rina'?",
            options: ["He", "She", "It", "They"],
            answer: "She",
            explanation: "Rina adalah nama perempuan, jadi subject pronoun yang tepat adalah She."
        },
        {
            type: "Subject",
            question: "Pronoun mana yang bisa menggantikan 'Budi'?",
            options: ["She", "He", "They", "We"],
            answer: "He",
            explanation: "Budi adalah nama laki-laki, jadi subject pronoun yang tepat adalah He."
        },
        {
            type: "Subject",
            question: "Pronoun mana yang bisa menggantikan 'The cat'?",
            options: ["It", "They", "We", "You"],
            answer: "It",
            explanation: "The cat dapat diganti dengan It jika merujuk pada satu hewan."
        },
        {
            type: "Subject",
            question: "Pronoun mana yang bisa menggantikan 'Budi & Rina'?",
            options: ["They", "He", "She", "It"],
            answer: "They",
            explanation: "Budi and Rina berarti lebih dari satu orang, jadi pronoun yang tepat adalah They."
        },
        {
            type: "Object",
            question: "I know ____.",
            options: ["she", "her", "they", "we"],
            answer: "her",
            explanation: "Setelah verb 'know', gunakan object pronoun. Object pronoun dari she adalah her."
        },
        {
            type: "Object",
            question: "She helps ____.",
            options: ["I", "me", "my", "mine"],
            answer: "me",
            explanation: "Setelah verb 'helps', gunakan object pronoun. Object pronoun dari I adalah me."
        },
        {
            type: "Possessive",
            question: "This is ____ book.",
            options: ["I", "me", "my", "mine"],
            answer: "my",
            explanation: "Sebelum noun 'book', gunakan possessive adjective. Bentuk yang benar adalah my book."
        },
        {
            type: "Possessive",
            question: "That bag is ____.",
            options: ["her", "hers", "she", "herself"],
            answer: "hers",
            explanation: "Karena tidak ada noun setelahnya, gunakan possessive pronoun: hers."
        },
        {
            type: "Reflexive",
            question: "He teaches ____.",
            options: ["him", "his", "himself", "he"],
            answer: "himself",
            explanation: "Subject dan object merujuk pada orang yang sama, jadi gunakan reflexive pronoun: himself."
        },
        {
            type: "Concept",
            question: "Pronouns digunakan untuk menggantikan...",
            options: ["Verbs", "Nouns", "Adjectives", "Adverbs"],
            answer: "Nouns",
            explanation: "Pronoun digunakan untuk menggantikan noun agar kalimat tidak berulang."
        }
    ]
},

verb: {
    title: "Verb",
    description: "Verb adalah kata yang menunjukkan aksi, aktivitas, kejadian, atau keadaan. Verb merupakan inti dari hampir semua kalimat Bahasa Inggris.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subject + Verb + Object/Complement
    `,

    notes: [
        "Verb adalah kata kerja atau kata yang menunjukkan keadaan.",
        "Setiap kalimat umumnya membutuhkan verb.",
        "Action Verb menunjukkan tindakan.",
        "Linking Verb menghubungkan subject dengan informasi tambahan.",
        "Helping Verb membantu verb utama membentuk tenses atau struktur tertentu.",
        "Verb dapat berubah bentuk sesuai tense."
    ],

    patterns: [
        {
            group: "Action Verb",
            items: [
                {
                    label: "Action",
                    formula: "Subject + Action Verb + Object",
                    examples: [
                        "I eat rice.",
                        "She reads a book.",
                        "They play football."
                    ]
                }
            ]
        },

        {
            group: "Linking Verb",
            items: [
                {
                    label: "Be Verb",
                    formula: "Subject + am/is/are + Complement",
                    examples: [
                        "I am happy.",
                        "She is smart.",
                        "They are students."
                    ]
                }
            ]
        },

        {
            group: "Helping Verb",
            items: [
                {
                    label: "Auxiliary",
                    formula: "Subject + Helping Verb + Main Verb",
                    examples: [
                        "I am studying English.",
                        "She has finished her homework.",
                        "They will come tomorrow."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Action",
            question: "Kata mana yang merupakan verb?",
            options: ["Run", "Blue", "Book", "School"],
            answer: "Run",
            explanation: "Run adalah action verb karena menunjukkan aktivitas."
        },
        {
            type: "Action",
            question: "Kalimat mana yang mengandung action verb?",
            options: [
                "She reads a book.",
                "She is smart.",
                "They are students.",
                "The car is red."
            ],
            answer: "She reads a book.",
            explanation: "Reads adalah action verb."
        },
        {
            type: "Linking",
            question: "Verb mana yang merupakan linking verb?",
            options: ["Run", "Eat", "Is", "Play"],
            answer: "Is",
            explanation: "Is menghubungkan subject dengan informasi tambahan."
        },
        {
            type: "Linking",
            question: "She ___ happy.",
            options: ["run", "eat", "is", "play"],
            answer: "is",
            explanation: "Kalimat nominal menggunakan linking verb."
        },
        {
            type: "Helping",
            question: "Kalimat mana yang mengandung helping verb?",
            options: [
                "I am studying.",
                "She reads.",
                "They play football.",
                "We eat rice."
            ],
            answer: "I am studying.",
            explanation: "Am adalah helping verb untuk Present Continuous."
        },
        {
            type: "Helping",
            question: "Kata mana yang merupakan helping verb?",
            options: ["Have", "Book", "Blue", "School"],
            answer: "Have",
            explanation: "Have dapat berfungsi sebagai helping verb."
        },
        {
            type: "Concept",
            question: "Apa fungsi dari verb?",
            options: [
                "Menjelaskan kata benda (noun)",
                "Menunjukkan aksi atau keadaan",
                "Menghubungkan ide",
                "Menunjukkan Emosi"
            ],
            answer: "Menunjukkan aksi atau keadaan",
            explanation: "Verb menunjukkan aksi atau keadaan."
        },
        {
            type: "Concept",
            question: "Setiap kalimat yang lengkap biasanya membutuhkan...",
            options: ["A verb", "An adjective", "An adverb", "A conjunction"],
            answer: "A verb",
            explanation: "Verb merupakan inti dari sebagian besar kalimat."
        },
        {
            type: "Action",
            question: "kata manakah yang merupakan verb pada 'They play football'?",
            options: ["They", "Play", "Football", "The"],
            answer: "Play",
            explanation: "Play adalah kata kerja pada kalimat tersebut."
        },
        {
            type: "Concept",
            question: "Kata 'study' masuk kategori verb apa?",
            options: [
                "Action Verb",
                "Linking Verb",
                "Helping Verb",
                "Pronoun"
            ],
            answer: "Action Verb",
            explanation: "Study menunjukkan aktivitas."
        }
    ]
},

adjective: {
    title: "Adjective",
    description: "Adjective adalah kata yang digunakan untuk menjelaskan noun atau pronoun. Adjective memberi informasi tentang sifat, warna, ukuran, bentuk, jumlah, atau kondisi suatu benda/orang.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Adjective + Noun<br>
        Subject + to be + Adjective
    `,

    notes: [
        "Adjective menjelaskan noun atau pronoun.",
        "Adjective sering berada sebelum noun.",
        "Adjective juga bisa berada setelah to be.",
        "Adjective menjawab pertanyaan: seperti apa?",
        "Adjective dapat menjelaskan warna, ukuran, sifat, jumlah, atau kondisi."
    ],

    patterns: [
        {
            group: "Before Noun",
            items: [
                {
                    label: "Adjective + Noun",
                    formula: "Adjective + Noun",
                    examples: [
                        "She has a beautiful bag.",
                        "He drives a red car.",
                        "They live in a big house."
                    ]
                }
            ]
        },
        {
            group: "After To Be",
            items: [
                {
                    label: "To Be + Adjective",
                    formula: "Subject + am/is/are + Adjective",
                    examples: [
                        "She is smart.",
                        "The room is clean.",
                        "They are happy."
                    ]
                }
            ]
        },
        {
            group: "Kinds of Adjective",
            items: [
                {
                    label: "Quality",
                    formula: "Quality Adjective = describes condition/character",
                    examples: ["smart student", "kind teacher", "clean room"]
                },
                {
                    label: "Color",
                    formula: "Color Adjective = describes color",
                    examples: ["red car", "blue bag", "white shirt"]
                },
                {
                    label: "Size",
                    formula: "Size Adjective = describes size",
                    examples: ["big house", "small cat", "tall building"]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "adjective menjelaskan tentang apa?",
            options: ["Noun", "Verb", "Adverb", "Conjunction"],
            answer: "Noun",
            explanation: "Adjective digunakan untuk menjelaskan noun."
        },
        {
            type: "Identify",
            question: "kata mana yang merupakan adjective?",
            options: ["Beautiful", "Run", "Quickly", "School"],
            answer: "Beautiful",
            explanation: "Beautiful adalah adjective karena menjelaskan sifat."
        },
        {
            type: "Sentence",
            question: "Kalimat mana yang mengandung adjective?",
            options: [
                "She runs fast.",
                "He has a red car.",
                "They eat rice.",
                "I go home."
            ],
            answer: "He has a red car.",
            explanation: "Red adalah adjective karena menjelaskan noun car."
        },
        {
            type: "Position",
            question: "Pilih frasa yang tepat.",
            options: ["car red", "red car", "run red", "quickly car"],
            answer: "red car",
            explanation: "Adjective biasanya berada sebelum noun."
        },
        {
            type: "To Be",
            question: "She is ____.",
            options: ["smart", "student", "quickly", "run"],
            answer: "smart",
            explanation: "Setelah to be dapat memakai adjective."
        },
        {
            type: "Color",
            question: "Kata mana yang merupakan color adjective?",
            options: ["Blue", "Eat", "Teacher", "Slowly"],
            answer: "Blue",
            explanation: "Blue menjelaskan warna."
        },
        {
            type: "Size",
            question: "Frasa mana yang menggunakan adjective of size?",
            options: ["big house", "run fast", "go home", "eat rice"],
            answer: "big house",
            explanation: "Big adalah adjective yang menjelaskan ukuran."
        },
        {
            type: "Meaning",
            question: "Apa adjective pada 'The room is clean'?",
            options: ["The", "Room", "Is", "Clean"],
            answer: "Clean",
            explanation: "Clean menjelaskan kondisi room."
        },
        {
            type: "Concept",
            question: "Adjective menjawab tentang pertanyaan...",
            options: ["How is it?", "When?", "Where?", "Why?"],
            answer: "How is it?",
            explanation: "Adjective menjelaskan seperti apa noun tersebut."
        },
        {
            type: "Identify",
            question: "Kata mana yang menjelaskan tentang student?",
            options: ["Smart", "Study", "School", "Very"],
            answer: "Smart",
            explanation: "Smart dapat menjelaskan student."
        }
    ]
},

adverb: {
    title: "Adverb",
    description: "Adverb adalah kata yang menjelaskan verb, adjective, atau adverb lain. Adverb sering memberi informasi tentang cara, waktu, tempat, frekuensi, atau tingkat.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + Adverb<br>
        Adverb + Adjective<br>
        Adverb + Adverb
    `,

    notes: [
        "Adverb dapat menjelaskan verb.",
        "Adverb dapat menjelaskan adjective.",
        "Adverb dapat menjelaskan adverb lain.",
        "Banyak adverb berakhiran -ly, seperti quickly dan slowly.",
        "Adverb dapat menjelaskan cara, waktu, tempat, frekuensi, atau tingkat."
    ],

    patterns: [
        {
            group: "Adverb of Manner",
            items: [
                {
                    label: "How",
                    formula: "Subject + Verb + Adverb",
                    examples: [
                        "He runs quickly.",
                        "She speaks clearly.",
                        "They work carefully."
                    ]
                }
            ]
        },
        {
            group: "Adverb of Frequency",
            items: [
                {
                    label: "How Often",
                    formula: "Subject + Frequency Adverb + Verb",
                    examples: [
                        "I always study English.",
                        "She usually wakes up early.",
                        "They often play football."
                    ]
                }
            ]
        },
        {
            group: "Adverb of Degree",
            items: [
                {
                    label: "How Much",
                    formula: "Adverb + Adjective",
                    examples: [
                        "She is very smart.",
                        "This lesson is really easy.",
                        "He is too tired."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "adverb menjelaskan tentang apa?",
            options: ["Verb", "Noun only", "Pronoun only", "Article"],
            answer: "Verb",
            explanation: "Adverb dapat menjelaskan verb."
        },
        {
            type: "Identify",
            question: "Kata mana yang termasuk adverb?",
            options: ["Quickly", "Book", "Happy", "Teacher"],
            answer: "Quickly",
            explanation: "Quickly adalah adverb karena menjelaskan cara melakukan aksi."
        },
        {
            type: "Manner",
            question: "Apa adverb pada 'He runs quickly'?",
            options: ["He", "Runs", "Quickly", "The"],
            answer: "Quickly",
            explanation: "Quickly menjelaskan bagaimana he runs."
        },
        {
            type: "Frequency",
            question: "Kata mana yang merupakan adverb of frequency?",
            options: ["Always", "Beautiful", "School", "Under"],
            answer: "Always",
            explanation: "Always menunjukkan seberapa sering aksi dilakukan."
        },
        {
            type: "Degree",
            question: "She is very smart. kata 'very' merupakan?",
            options: ["Adverb", "Noun", "Verb", "Conjunction"],
            answer: "Adverb",
            explanation: "Very menjelaskan adjective smart."
        },
        {
            type: "Sentence",
            question: "Kalimat mana yang mengandung adverb?",
            options: [
                "She has a red bag.",
                "He runs slowly.",
                "This is a book.",
                "They are students."
            ],
            answer: "He runs slowly.",
            explanation: "Slowly adalah adverb."
        },
        {
            type: "Manner",
            question: "Pilih adverb yang tepat.",
            options: ["Carefully", "Careful", "Care", "Cares"],
            answer: "Carefully",
            explanation: "Carefully adalah adverb of manner."
        },
        {
            type: "Concept",
            question: "Kebanyakan adverbs of manner berakhir dengan...",
            options: ["-ly", "-s", "-ing", "-ed"],
            answer: "-ly",
            explanation: "Banyak adverb of manner berakhiran -ly."
        },
        {
            type: "Position",
            question: "Frasa mana yang tepat?",
            options: ["runs quickly", "quickly student", "book quickly", "red quickly"],
            answer: "runs quickly",
            explanation: "Adverb dapat muncul setelah verb."
        },
        {
            type: "Degree",
            question: "Kata mana yang bisa melengkapi: 'This lesson is ____ easy'?",
            options: ["very", "school", "eat", "under"],
            answer: "very",
            explanation: "Very adalah adverb of degree."
        }
    ]
},


preposition: {
    title: "Preposition",
    description: "Preposition adalah kata yang menunjukkan hubungan antara noun/pronoun dengan kata lain dalam kalimat. Preposition sering menunjukkan tempat, waktu, arah, atau hubungan posisi.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Preposition + Noun/Pronoun<br>
        on the table • at 7 PM • to school
    `,

    notes: [
        "Preposition biasanya diikuti noun atau pronoun.",
        "Preposition dapat menunjukkan tempat.",
        "Preposition dapat menunjukkan waktu.",
        "Preposition dapat menunjukkan arah.",
        "Preposition membantu menjelaskan hubungan antar kata dalam kalimat."
    ],

    patterns: [
        {
            group: "Place",
            items: [
                {
                    label: "Position",
                    formula: "Preposition + Place",
                    examples: [
                        "The book is on the table.",
                        "The cat is under the chair.",
                        "She is in the room."
                    ]
                }
            ]
        },
        {
            group: "Time",
            items: [
                {
                    label: "Time Marker",
                    formula: "at / on / in + Time",
                    examples: [
                        "I wake up at 6 AM.",
                        "We study on Monday.",
                        "She was born in 2010."
                    ]
                }
            ]
        },
        {
            group: "Direction",
            items: [
                {
                    label: "Movement",
                    formula: "to / from / into + Place",
                    examples: [
                        "She goes to school.",
                        "He comes from Jakarta.",
                        "They walk into the room."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Place",
            question: "Kata mana yang merupakan preposition?",
            options: ["Under", "Beautiful", "Run", "Wow"],
            answer: "Under",
            explanation: "Under adalah preposition karena menunjukkan posisi."
        },
        {
            type: "Place",
            question: "The book is ___ the table.",
            options: ["on", "and", "wow", "quickly"],
            answer: "on",
            explanation: "On menunjukkan posisi benda di atas permukaan."
        },
        {
            type: "Time",
            question: "I wake up ___ 6 AM.",
            options: ["at", "on", "in", "to"],
            answer: "at",
            explanation: "Gunakan at untuk waktu jam tertentu."
        },
        {
            type: "Time",
            question: "We study ___ Monday.",
            options: ["at", "on", "in", "from"],
            answer: "on",
            explanation: "Gunakan on untuk nama hari."
        },
        {
            type: "Direction",
            question: "She goes ___ school.",
            options: ["to", "under", "at", "in"],
            answer: "to",
            explanation: "To menunjukkan arah atau tujuan."
        },
        {
            type: "Place",
            question: "The cat is ___ the chair.",
            options: ["under", "because", "happy", "eat"],
            answer: "under",
            explanation: "Under menunjukkan posisi di bawah sesuatu."
        },
        {
            type: "Concept",
            question: "preposition biasanya datang sebelum...",
            options: ["Noun or pronoun", "Verb only", "Adjective only", "Interjection"],
            answer: "Noun or pronoun",
            explanation: "Preposition biasanya diikuti noun atau pronoun."
        },
        {
            type: "Identify",
            question: "Kalimat mana yang mengandung preposition?",
            options: [
                "She is smart.",
                "The bag is on the chair.",
                "They are happy.",
                "Wow! Amazing."
            ],
            answer: "The bag is on the chair.",
            explanation: "On adalah preposition."
        },
        {
            type: "Direction",
            question: "He comes ___ Bandung.",
            options: ["from", "and", "very", "blue"],
            answer: "from",
            explanation: "From menunjukkan asal."
        },
        {
            type: "Concept",
            question: "Apa yang preposition tunjukkan?",
            options: ["Relationship", "Emotion", "Action only", "Name only"],
            answer: "Relationship",
            explanation: "Preposition menunjukkan hubungan tempat, waktu, arah, atau posisi."
        }
    ]
},

conjunction: {
    title: "Conjunction",
    description: "Conjunction adalah kata yang digunakan untuk menghubungkan kata, frasa, atau klausa. Conjunction membantu membuat kalimat lebih lengkap dan hubungan antar ide menjadi jelas.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Word + Conjunction + Word<br>
        Clause + Conjunction + Clause
    `,

    notes: [
        "Conjunction menghubungkan dua kata.",
        "Conjunction menghubungkan dua frasa.",
        "Conjunction menghubungkan dua klausa atau ide.",
        "And digunakan untuk menambahkan informasi.",
        "But digunakan untuk menunjukkan pertentangan.",
        "Because digunakan untuk menunjukkan alasan.",
        "So digunakan untuk menunjukkan akibat."
    ],

    patterns: [
        {
            group: "Addition",
            items: [
                {
                    label: "And",
                    formula: "Word/Clause + and + Word/Clause",
                    examples: [
                        "I like tea and coffee.",
                        "She reads and writes.",
                        "Budi and Rina are students."
                    ]
                }
            ]
        },
        {
            group: "Contrast",
            items: [
                {
                    label: "But",
                    formula: "Clause + but + Clause",
                    examples: [
                        "He is tired but happy.",
                        "I like English but I dislike math.",
                        "She is young but smart."
                    ]
                }
            ]
        },
        {
            group: "Reason & Result",
            items: [
                {
                    label: "Because / So",
                    formula: "Clause + because/so + Clause",
                    examples: [
                        "I study because I have a test.",
                        "It rains, so I stay at home.",
                        "She is hungry, so she eats."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Identify",
            question: "Kata mana yang merupakan conjunction?",
            options: ["And", "Quickly", "School", "Beautiful"],
            answer: "And",
            explanation: "And adalah conjunction karena menghubungkan kata atau ide."
        },
        {
            type: "Addition",
            question: "I like tea ___ coffee.",
            options: ["and", "but", "because", "under"],
            answer: "and",
            explanation: "And digunakan untuk menambahkan informasi."
        },
        {
            type: "Contrast",
            question: "He is tired ___ happy.",
            options: ["but", "and", "so", "in"],
            answer: "but",
            explanation: "But digunakan untuk menunjukkan pertentangan."
        },
        {
            type: "Reason",
            question: "She studies ___ she has a test.",
            options: ["because", "but", "and", "on"],
            answer: "because",
            explanation: "Because menunjukkan alasan."
        },
        {
            type: "Result",
            question: "It rains, ___ I stay at home.",
            options: ["so", "because", "but", "or"],
            answer: "so",
            explanation: "So menunjukkan akibat atau hasil."
        },
        {
            type: "Choice",
            question: "You can choose tea ___ coffee.",
            options: ["or", "because", "under", "quickly"],
            answer: "or",
            explanation: "Or digunakan untuk pilihan."
        },
        {
            type: "Concept",
            question: "Apa fungsi dari conjunction?",
            options: [
                "Menghubungkan kata atau ide",
                "Menjelaskan kata benda (noun)",
                "Menunjukkan emosi",
                "Menggantikan kata benda (noun)"
            ],
            answer: "CMenghubungkan kata atau ide",
            explanation: "Conjunction menghubungkan kata, frasa, atau klausa."
        },
        {
            type: "Identify",
            question: "Kalimat mana yang menggunakan conjunction?",
            options: [
                "She is smart.",
                "I like apples and oranges.",
                "The book is on the table.",
                "Wow! Great."
            ],
            answer: "I like apples and oranges.",
            explanation: "And adalah conjunction."
        },
        {
            type: "Contrast",
            question: "Pilih conjunction yang paling tepat: 'I am hungry ___ I have no food.'",
            options: ["but", "and", "so", "because"],
            answer: "but",
            explanation: "But menunjukkan pertentangan antara hungry dan no food."
        },
        {
            type: "Reason",
            question: "Kata mana yang menunjukkan alasan?",
            options: ["Because", "And", "Or", "Wow"],
            answer: "Because",
            explanation: "Because digunakan untuk menyatakan alasan."
        }
    ]
},

interjection: {
    title: "Interjection",
    description: "Interjection adalah kata atau ungkapan singkat yang menunjukkan emosi, reaksi, atau perasaan secara langsung. Interjection sering berdiri sendiri dan biasanya diikuti tanda seru.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Interjection + !<br>
        Wow! • Oops! • Hey! • Ouch!
    `,

    notes: [
        "Interjection menunjukkan ekspresi atau emosi singkat.",
        "Interjection sering memakai tanda seru.",
        "Interjection dapat berdiri sendiri.",
        "Wow digunakan untuk rasa kagum.",
        "Oops digunakan saat terjadi kesalahan kecil.",
        "Ouch digunakan saat merasa sakit.",
        "Hey digunakan untuk memanggil perhatian."
    ],

    patterns: [
        {
            group: "Surprise",
            items: [
                {
                    label: "Wow",
                    formula: "Wow! + Sentence",
                    examples: [
                        "Wow! That is amazing.",
                        "Wow! You are very smart.",
                        "Wow! This place is beautiful."
                    ]
                }
            ]
        },
        {
            group: "Mistake",
            items: [
                {
                    label: "Oops",
                    formula: "Oops! + Sentence",
                    examples: [
                        "Oops! I made a mistake.",
                        "Oops! I forgot my book.",
                        "Oops! That was wrong."
                    ]
                }
            ]
        },
        {
            group: "Attention",
            items: [
                {
                    label: "Hey / Ouch",
                    formula: "Interjection! + Sentence",
                    examples: [
                        "Hey! Listen to me.",
                        "Hey! Wait for me.",
                        "Ouch! My hand hurts."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Identify",
            question: "Kata mana yang merupakan interjection?",
            options: ["Wow!", "School", "Run", "Beautiful"],
            answer: "Wow!",
            explanation: "Wow! adalah interjection karena menunjukkan rasa kagum."
        },
        {
            type: "Emotion",
            question: "interjection mana yang menunjukkan surprise/keterkejutan?",
            options: ["Wow!", "And", "Under", "Book"],
            answer: "Wow!",
            explanation: "Wow! digunakan untuk menunjukkan rasa kagum atau terkejut."
        },
        {
            type: "Mistake",
            question: "interjection mana yang digunakan untuk kesalahan kecil?",
            options: ["Oops!", "Because", "Quickly", "They"],
            answer: "Oops!",
            explanation: "Oops! digunakan saat terjadi kesalahan kecil."
        },
        {
            type: "Pain",
            question: "interjection mana yang menunjukkan kesakitan?",
            options: ["Ouch!", "And", "Happy", "School"],
            answer: "Ouch!",
            explanation: "Ouch! digunakan saat merasa sakit."
        },
        {
            type: "Attention",
            question: "interjection mana yang digunakan untuk mendapat/menarik perhatian?",
            options: ["Hey!", "Book", "Slowly", "Red"],
            answer: "Hey!",
            explanation: "Hey! digunakan untuk menarik perhatian."
        },
        {
            type: "Punctuation",
            question: "Interjections sering menggunakan...",
            options: ["Tanda Seru!", "Hanya Coma,", "Hanya Tanda tanya", "Hanya titik"],
            answer: "Tanda Seru!",
            explanation: "Interjection sering diikuti tanda seru."
        },
        {
            type: "Concept",
            question: "Apa yang interjection ekspresikan/ungkapkan?",
            options: ["Emosi or reaksi", "Tempat", "Kepemilikan", "Angka"],
            answer: "Emotion or reaction",
            explanation: "Interjection mengekspresikan emosi atau reaksi."
        },
        {
            type: "Sentence",
            question: "Kalimat mana yang mengandung interjection?",
            options: [
                "Wow! That is great.",
                "She reads a book.",
                "The cat is under the table.",
                "I like tea and coffee."
            ],
            answer: "Wow! That is great.",
            explanation: "Wow! adalah interjection."
        },
        {
            type: "Concept",
            question: "Bisakah interjection berdiri sendiri?",
            options: ["Ya,bisa", "Tidak", "Hanya setelah noun", "Hanya sebelum verb"],
            answer: "Ya,bisa",
            explanation: "Interjection bisa berdiri sendiri sebagai ekspresi."
        },
        {
            type: "Identify",
            question: "Manakah yang bukan interjection?",
            options: ["Wow!", "Oops!", "Ouch!", "Table"],
            answer: "Table",
            explanation: "Table adalah noun, bukan interjection."
        }
    ]
},

"present-tense": {
    title: "Present Tense",
    description: "Present Tense digunakan untuk membicarakan kebiasaan, fakta umum, aktivitas yang sedang berlangsung, dan kejadian yang sudah terjadi tetapi masih berhubungan dengan sekarang.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Present = Subject + V1/V1(s/es)<br>
        Present Continuous = Subject + am/is/are + V-ing<br>
        Present Perfect = Subject + have/has + V3
    `,

    notes: [
        "Simple Present digunakan untuk kebiasaan, rutinitas, dan fakta umum.",
        "Present Continuous digunakan untuk aktivitas yang sedang terjadi sekarang.",
        "Present Perfect digunakan untuk pengalaman atau kejadian yang sudah terjadi dan masih relevan.",
        "He, She, It pada Simple Present memakai V1+s/es.",
        "Present Continuous selalu memakai am/is/are + V-ing.",
        "Present Perfect memakai have/has + V3."
    ],

    patterns: [
    {
        group: "Simple Present",
        items: [
            {
                label: "Verbal Positive",
                formula: "Subject + V1/V1(s/es) + Object/Adverb",
                examples: [
                    "I study English every day.",
                    "She studies English every day.",
                    "They play football."
                ]
            },
            {
                label: "Verbal Negative",
                formula: "Subject + do/does + not + V1",
                examples: [
                    "I do not study English.",
                    "She does not study English.",
                    "They do not play football."
                ]
            },
            {
                label: "Verbal Question",
                formula: "Do/Does + Subject + V1?",
                examples: [
                    "Do you study English?",
                    "Does she study English?",
                    "Do they play football?"
                ]
            },
            {
                label: "Nominal Positive",
                formula: "Subject + am/is/are + Complement",
                examples: [
                    "I am a student.",
                    "She is happy.",
                    "They are teachers."
                ]
            },
            {
                label: "Nominal Negative",
                formula: "Subject + am/is/are + not + Complement",
                examples: [
                    "I am not a student.",
                    "She is not happy.",
                    "They are not teachers."
                ]
            },
            {
                label: "Nominal Question",
                formula: "Am/Is/Are + Subject + Complement?",
                examples: [
                    "Are you a student?",
                    "Is she happy?",
                    "Are they teachers?"
                ]
            }
        ]
    },
    {
        group: "Present Continuous",
        items: [
            {
                label: "Verbal Positive",
                formula: "Subject + am/is/are + V-ing",
                examples: [
                    "I am studying English now.",
                    "She is reading a book.",
                    "They are playing football."
                ]
            },
            {
                label: "Verbal Negative",
                formula: "Subject + am/is/are + not + V-ing",
                examples: [
                    "I am not studying now.",
                    "She is not reading a book.",
                    "They are not playing football."
                ]
            },
            {
                label: "Verbal Question",
                formula: "Am/Is/Are + Subject + V-ing?",
                examples: [
                    "Are you studying now?",
                    "Is she reading a book?",
                    "Are they playing football?"
                ]
            },
        ]
    },

    {
    group: "Present Perfect",
    items: [
        {
            label: "Verbal Positive",
            formula: "Subject + have/has + V3",
            examples: [
                "I have finished my homework.",
                "She has eaten breakfast.",
                "They have visited Bali."
            ]
        },
        {
            label: "Verbal Negative",
            formula: "Subject + have/has + not + V3",
            examples: [
                "I have not finished my homework.",
                "She has not eaten breakfast.",
                "They have not visited Bali."
            ]
        },
        {
            label: "Verbal Question",
            formula: "Have/Has + Subject + V3?",
            examples: [
                "Have you finished your homework?",
                "Has she eaten breakfast?",
                "Have they visited Bali?"
            ]
        },
        {
            label: "Nominal Positive",
            formula: "Subject + have/has + been + Complement",
            examples: [
                "I have been busy.",
                "She has been sick.",
                "They have been students."
            ]
        },
        {
            label: "Nominal Negative",
            formula: "Subject + have/has + not + been + Complement",
            examples: [
                "I have not been busy.",
                "She has not been sick.",
                "They have not been students."
            ]
        },
        {
            label: "Nominal Question",
            formula: "Have/Has + Subject + been + Complement?",
            examples: [
                "Have you been busy?",
                "Has she been sick?",
                "Have they been students?"
            ]
        }
    ]
}
],

    quiz: [
        {
            type: "Simple",
            question: "She ___ English every day.",
            options: ["study", "studies", "studying", "studied"],
            answer: "studies",
            explanation: "Simple Present untuk subject She memakai V1+s/es."
        },
        {
            type: "Simple",
            question: "They ___ football every Sunday.",
            options: ["plays", "play", "playing", "played"],
            answer: "play",
            explanation: "Subject They memakai V1 biasa."
        },
        {
            type: "Simple",
            question: "She ___ not study English.",
            options: ["do", "does", "is", "has"],
            answer: "does",
            explanation: "Kalimat negatif Simple Present untuk She memakai does not + V1."
        },
        {
            type: "Continuous",
            question: "She ___ reading a book now.",
            options: ["is", "are", "am", "has"],
            answer: "is",
            explanation: "Present Continuous untuk She memakai is + V-ing."
        },
        {
            type: "Continuous",
            question: "They ___ playing football now.",
            options: ["is", "am", "are", "have"],
            answer: "are",
            explanation: "Present Continuous untuk They memakai are + V-ing."
        },
        {
            type: "Continuous",
            question: "I am ___ English now.",
            options: ["study", "studies", "studying", "studied"],
            answer: "studying",
            explanation: "Present Continuous memakai V-ing."
        },
        {
            type: "Perfect",
            question: "She ___ finished her homework.",
            options: ["have", "has", "is", "does"],
            answer: "has",
            explanation: "Present Perfect untuk She memakai has + V3."
        },
        {
            type: "Perfect",
            question: "They ___ visited Bali.",
            options: ["has", "have", "are", "do"],
            answer: "have",
            explanation: "Present Perfect untuk They memakai have + V3."
        },
        {
            type: "Perfect",
            question: "I have ___ breakfast.",
            options: ["eat", "eats", "eating", "eaten"],
            answer: "eaten",
            explanation: "Present Perfect memakai verb bentuk ketiga atau V3."
        },
        {
            type: "Concept",
            question: "Which tense uses am/is/are + V-ing?",
            options: ["Simple Present", "Present Continuous", "Present Perfect", "Simple Past"],
            answer: "Present Continuous",
            explanation: "Present Continuous memakai am/is/are + V-ing."
        },
{
    type: "Simple Nominal",
    question: "She ___ a student.",
    options: ["am", "is", "are", "do"],
    answer: "is",
    explanation: "Simple Present nominal untuk subject She memakai is."
},
{
    type: "Simple Nominal",
    question: "They ___ not teachers.",
    options: ["is", "am", "are", "does"],
    answer: "are",
    explanation: "Simple Present nominal untuk subject They memakai are not."
},
{
    type: "Simple Nominal",
    question: "___ you happy?",
    options: ["Do", "Does", "Are", "Is"],
    answer: "Are",
    explanation: "Pertanyaan nominal Simple Present memakai am/is/are di depan subject."
},
{
    type: "Perfect Nominal",
    question: "She ___ been sick.",
    options: ["have", "has", "is", "does"],
    answer: "has",
    explanation: "Present Perfect Nominal untuk subject She memakai has been + complement."
},
{
    type: "Perfect Nominal",
    question: "They have ___ students.",
    options: ["be", "been", "being", "are"],
    answer: "been",
    explanation: "Present Perfect Nominal memakai have/has + been + complement."
},
{
    type: "Perfect Nominal",
    question: "___ you been busy?",
    options: ["Do", "Are", "Have", "Has"],
    answer: "Have",
    explanation: "Pertanyaan Present Perfect Nominal memakai Have/Has + subject + been + complement."
},
{
    type: "Continuous",
    question: "She ___ reading a book now.",
    options: ["is", "are", "am", "has"],
    answer: "is",
    explanation: "Subject She menggunakan is + V-ing pada Present Continuous."
},
{
    type: "Continuous",
    question: "They ___ playing football now.",
    options: ["is", "am", "are", "has"],
    answer: "are",
    explanation: "Subject They menggunakan are + V-ing."
},
{
    type: "Continuous",
    question: "___ you studying English now?",
    options: ["Do", "Have", "Are", "Does"],
    answer: "Are",
    explanation: "Pertanyaan Present Continuous memakai Am/Is/Are di depan subject."
},
{
    type: "Perfect",
    question: "She has ___ her homework.",
    options: ["finish", "finished", "finishing", "finishes"],
    answer: "finished",
    explanation: "Present Perfect memakai have/has + V3."
}



    ]
},

"past-tense": {
    title: "Past Tense",
    description: "Past Tense digunakan untuk membicarakan kejadian, aktivitas, keadaan, atau pengalaman yang terjadi di masa lampau. Dalam modul ini, kamu mempelajari Simple Past, Past Continuous, dan Past Perfect.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Past = Subject + V2<br>
        Past Continuous = Subject + was/were + V-ing<br>
        Past Perfect = Subject + had + V3
    `,

    notes: [
        "Simple Past digunakan untuk kejadian yang selesai di masa lampau.",
        "Past Continuous digunakan untuk aktivitas yang sedang berlangsung pada waktu tertentu di masa lampau.",
        "Past Perfect digunakan untuk kejadian yang sudah selesai sebelum kejadian lain di masa lampau.",
        "Simple Past verbal memakai V2.",
        "Simple Past nominal memakai was/were + complement.",
        "Past Continuous selalu memakai was/were + V-ing.",
        "Past Perfect memakai had + V3.",
        "Past Perfect nominal memakai had been + complement."
    ],

    patterns: [
        {
            group: "Simple Past",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + V2 + Object/Adverb",
                    examples: [
                        "I studied English yesterday.",
                        "She watched a movie last night.",
                        "They played football two days ago."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + did + not + V1",
                    examples: [
                        "I did not study English yesterday.",
                        "She did not watch a movie.",
                        "They did not play football."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Did + Subject + V1?",
                    examples: [
                        "Did you study English yesterday?",
                        "Did she watch a movie?",
                        "Did they play football?"
                    ]
                },
                {
                    label: "Nominal Positive",
                    formula: "Subject + was/were + Complement",
                    examples: [
                        "I was tired yesterday.",
                        "She was happy last night.",
                        "They were students."
                    ]
                },
                {
                    label: "Nominal Negative",
                    formula: "Subject + was/were + not + Complement",
                    examples: [
                        "I was not tired yesterday.",
                        "She was not happy.",
                        "They were not students."
                    ]
                },
                {
                    label: "Nominal Question",
                    formula: "Was/Were + Subject + Complement?",
                    examples: [
                        "Were you tired yesterday?",
                        "Was she happy?",
                        "Were they students?"
                    ]
                }
            ]
        },
        {
            group: "Past Continuous",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + was/were + V-ing",
                    examples: [
                        "I was studying English at 8 PM.",
                        "She was reading a book.",
                        "They were playing football."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + was/were + not + V-ing",
                    examples: [
                        "I was not studying at 8 PM.",
                        "She was not reading a book.",
                        "They were not playing football."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Was/Were + Subject + V-ing?",
                    examples: [
                        "Were you studying at 8 PM?",
                        "Was she reading a book?",
                        "Were they playing football?"
                    ]
                }
            ]
        },
        {
            group: "Past Perfect",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + had + V3",
                    examples: [
                        "I had finished my homework before dinner.",
                        "She had eaten breakfast before school.",
                        "They had visited Bali before 2020."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + had + not + V3",
                    examples: [
                        "I had not finished my homework.",
                        "She had not eaten breakfast.",
                        "They had not visited Bali."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Had + Subject + V3?",
                    examples: [
                        "Had you finished your homework?",
                        "Had she eaten breakfast?",
                        "Had they visited Bali?"
                    ]
                },
                {
                    label: "Nominal Positive",
                    formula: "Subject + had + been + Complement",
                    examples: [
                        "I had been busy before you called.",
                        "She had been sick before the exam.",
                        "They had been students before they worked."
                    ]
                },
                {
                    label: "Nominal Negative",
                    formula: "Subject + had + not + been + Complement",
                    examples: [
                        "I had not been busy.",
                        "She had not been sick.",
                        "They had not been students."
                    ]
                },
                {
                    label: "Nominal Question",
                    formula: "Had + Subject + been + Complement?",
                    examples: [
                        "Had you been busy?",
                        "Had she been sick?",
                        "Had they been students?"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Verbal",
            question: "She ___ English yesterday.",
            options: ["study", "studies", "studied", "studying"],
            answer: "studied",
            explanation: "Simple Past verbal memakai V2. Bentuk past dari study adalah studied."
        },
        {
            type: "Simple Verbal",
            question: "They ___ football last week.",
            options: ["play", "plays", "played", "playing"],
            answer: "played",
            explanation: "Simple Past memakai verb bentuk kedua atau V2."
        },
        {
            type: "Simple Verbal",
            question: "She ___ not watch TV last night.",
            options: ["do", "does", "did", "was"],
            answer: "did",
            explanation: "Negative Simple Past verbal memakai did not + V1."
        },
        {
            type: "Simple Verbal",
            question: "___ you study English yesterday?",
            options: ["Do", "Does", "Did", "Were"],
            answer: "Did",
            explanation: "Question Simple Past verbal memakai Did + subject + V1."
        },
        {
            type: "Simple Nominal",
            question: "She ___ happy yesterday.",
            options: ["is", "are", "was", "were"],
            answer: "was",
            explanation: "Simple Past nominal untuk subject She memakai was."
        },
        {
            type: "Simple Nominal",
            question: "They ___ students last year.",
            options: ["is", "are", "was", "were"],
            answer: "were",
            explanation: "Simple Past nominal untuk subject They memakai were."
        },
        {
            type: "Simple Nominal",
            question: "She ___ not tired yesterday.",
            options: ["was", "were", "did", "does"],
            answer: "was",
            explanation: "Negative Simple Past nominal memakai was/were not + complement."
        },
        {
            type: "Simple Nominal",
            question: "___ they at school yesterday?",
            options: ["Was", "Were", "Did", "Do"],
            answer: "Were",
            explanation: "Question Simple Past nominal memakai Was/Were di depan subject."
        },
        {
            type: "Continuous",
            question: "She ___ reading a book at 8 PM.",
            options: ["is", "are", "was", "were"],
            answer: "was",
            explanation: "Past Continuous untuk subject She memakai was + V-ing."
        },
        {
            type: "Continuous",
            question: "They ___ playing football yesterday afternoon.",
            options: ["is", "are", "was", "were"],
            answer: "were",
            explanation: "Past Continuous untuk subject They memakai were + V-ing."
        },
        {
            type: "Continuous",
            question: "I was ___ English when you called.",
            options: ["study", "studies", "studying", "studied"],
            answer: "studying",
            explanation: "Past Continuous memakai was/were + V-ing."
        },
        {
            type: "Continuous",
            question: "___ she watching TV at 9 PM?",
            options: ["Did", "Was", "Were", "Does"],
            answer: "Was",
            explanation: "Question Past Continuous memakai Was/Were + subject + V-ing."
        },
        {
            type: "Continuous",
            question: "They were not ___ football.",
            options: ["play", "plays", "playing", "played"],
            answer: "playing",
            explanation: "Negative Past Continuous memakai was/were not + V-ing."
        },
        {
            type: "Perfect Verbal",
            question: "She had ___ breakfast before school.",
            options: ["eat", "eats", "eating", "eaten"],
            answer: "eaten",
            explanation: "Past Perfect memakai had + V3."
        },
        {
            type: "Perfect Verbal",
            question: "They ___ visited Bali before 2020.",
            options: ["has", "have", "had", "were"],
            answer: "had",
            explanation: "Past Perfect untuk semua subject memakai had + V3."
        },
        {
            type: "Perfect Verbal",
            question: "She had not ___ her homework.",
            options: ["finish", "finished", "finishing", "finishes"],
            answer: "finished",
            explanation: "Past Perfect negative memakai had not + V3."
        },
        {
            type: "Perfect Verbal",
            question: "___ you finished your homework before dinner?",
            options: ["Have", "Has", "Had", "Did"],
            answer: "Had",
            explanation: "Question Past Perfect memakai Had + subject + V3."
        },
        {
            type: "Perfect Nominal",
            question: "She had ___ sick before the exam.",
            options: ["be", "been", "being", "was"],
            answer: "been",
            explanation: "Past Perfect nominal memakai had been + complement."
        },
        {
            type: "Perfect Nominal",
            question: "They had not ___ students before.",
            options: ["be", "been", "being", "were"],
            answer: "been",
            explanation: "Negative Past Perfect nominal memakai had not been + complement."
        },
        {
            type: "Concept",
            question: "Which tense uses Subject + was/were + V-ing?",
            options: ["Simple Past", "Past Continuous", "Past Perfect", "Simple Present"],
            answer: "Past Continuous",
            explanation: "Past Continuous memakai was/were + V-ing."
        }
    ]
},

"future-tense": {
    title: "Future Tense",
    description: "Future Tense digunakan untuk membicarakan rencana, prediksi, janji, keputusan, atau kejadian yang akan terjadi di masa depan. Dalam modul ini, kamu mempelajari Simple Future, Future Continuous, dan Future Perfect.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Future = Subject + will + V1<br>
        Future Continuous = Subject + will be + V-ing<br>
        Future Perfect = Subject + will have + V3
    `,

    notes: [
        "Simple Future digunakan untuk kejadian yang akan terjadi.",
        "Simple Future verbal memakai will + V1.",
        "Simple Future nominal memakai will be + complement.",
        "Future Continuous digunakan untuk aktivitas yang sedang berlangsung pada waktu tertentu di masa depan.",
        "Future Continuous memakai will be + V-ing.",
        "Future Perfect digunakan untuk kejadian yang akan sudah selesai sebelum waktu tertentu di masa depan.",
        "Future Perfect memakai will have + V3.",
        "Future Perfect nominal memakai will have been + complement."
    ],

    patterns: [
        {
            group: "Simple Future",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + will + V1",
                    examples: [
                        "I will study English tomorrow.",
                        "She will visit her grandmother.",
                        "They will play football next week."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + will + not + V1",
                    examples: [
                        "I will not study English tomorrow.",
                        "She will not visit her grandmother.",
                        "They will not play football next week."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Will + Subject + V1?",
                    examples: [
                        "Will you study English tomorrow?",
                        "Will she visit her grandmother?",
                        "Will they play football next week?"
                    ]
                },
                {
                    label: "Nominal Positive",
                    formula: "Subject + will be + Complement",
                    examples: [
                        "I will be busy tomorrow.",
                        "She will be a teacher.",
                        "They will be ready soon."
                    ]
                },
                {
                    label: "Nominal Negative",
                    formula: "Subject + will + not + be + Complement",
                    examples: [
                        "I will not be busy tomorrow.",
                        "She will not be a teacher.",
                        "They will not be ready soon."
                    ]
                },
                {
                    label: "Nominal Question",
                    formula: "Will + Subject + be + Complement?",
                    examples: [
                        "Will you be busy tomorrow?",
                        "Will she be a teacher?",
                        "Will they be ready soon?"
                    ]
                }
            ]
        },
        {
            group: "Future Continuous",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + will be + V-ing",
                    examples: [
                        "I will be studying at 8 PM.",
                        "She will be reading a book tonight.",
                        "They will be playing football tomorrow afternoon."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + will + not + be + V-ing",
                    examples: [
                        "I will not be studying at 8 PM.",
                        "She will not be reading a book tonight.",
                        "They will not be playing football tomorrow afternoon."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Will + Subject + be + V-ing?",
                    examples: [
                        "Will you be studying at 8 PM?",
                        "Will she be reading a book tonight?",
                        "Will they be playing football tomorrow afternoon?"
                    ]
                }
            ]
        },

        {
            group: "Future Perfect",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + will have + V3",
                    examples: [
                        "I will have finished my homework by 8 PM.",
                        "She will have eaten dinner before you arrive.",
                        "They will have completed the project by Monday."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + will + not + have + V3",
                    examples: [
                        "I will not have finished my homework by 8 PM.",
                        "She will not have eaten dinner before you arrive.",
                        "They will not have completed the project by Monday."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Will + Subject + have + V3?",
                    examples: [
                        "Will you have finished your homework by 8 PM?",
                        "Will she have eaten dinner before you arrive?",
                        "Will they have completed the project by Monday?"
                    ]
                },
                {
                    label: "Nominal Positive",
                    formula: "Subject + will have been + Complement",
                    examples: [
                        "I will have been ready before the meeting.",
                        "She will have been busy for two hours.",
                        "They will have been students for three years."
                    ]
                },
                {
                    label: "Nominal Negative",
                    formula: "Subject + will + not + have + been + Complement",
                    examples: [
                        "I will not have been ready before the meeting.",
                        "She will not have been busy for two hours.",
                        "They will not have been students for three years."
                    ]
                },
                {
                    label: "Nominal Question",
                    formula: "Will + Subject + have + been + Complement?",
                    examples: [
                        "Will you have been ready before the meeting?",
                        "Will she have been busy for two hours?",
                        "Will they have been students for three years?"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Verbal",
            question: "She ___ visit her grandmother tomorrow.",
            options: ["will", "is", "has", "did"],
            answer: "will",
            explanation: "Simple Future verbal memakai will + V1."
        },
        {
            type: "Simple Verbal",
            question: "They will ___ football next week.",
            options: ["play", "plays", "playing", "played"],
            answer: "play",
            explanation: "Setelah will, verb harus kembali ke V1."
        },
        {
            type: "Simple Verbal",
            question: "She will not ___ English tomorrow.",
            options: ["studies", "studying", "study", "studied"],
            answer: "study",
            explanation: "Negative Simple Future memakai will not + V1."
        },
        {
            type: "Simple Verbal",
            question: "___ you study English tomorrow?",
            options: ["Do", "Did", "Will", "Have"],
            answer: "Will",
            explanation: "Question Simple Future memakai Will + subject + V1."
        },
        {
            type: "Simple Nominal",
            question: "She will ___ a teacher.",
            options: ["is", "are", "be", "been"],
            answer: "be",
            explanation: "Simple Future nominal memakai will be + complement."
        },
        {
            type: "Simple Nominal",
            question: "They will ___ ready soon.",
            options: ["be", "are", "were", "been"],
            answer: "be",
            explanation: "Setelah will, bentuk be tetap be."
        },
        {
            type: "Simple Nominal",
            question: "She will not ___ busy tomorrow.",
            options: ["is", "be", "been", "being"],
            answer: "be",
            explanation: "Negative Simple Future nominal memakai will not be + complement."
        },
        {
            type: "Simple Nominal",
            question: "___ they be ready soon?",
            options: ["Do", "Did", "Will", "Have"],
            answer: "Will",
            explanation: "Question Simple Future nominal memakai Will + subject + be + complement."
        },
        {
            type: "Continuous",
            question: "She will be ___ a book tonight.",
            options: ["read", "reads", "reading", "readed"],
            answer: "reading",
            explanation: "Future Continuous memakai will be + V-ing."
        },
        {
            type: "Continuous",
            question: "They will be ___ football tomorrow afternoon.",
            options: ["play", "plays", "playing", "played"],
            answer: "playing",
            explanation: "Future Continuous memakai will be + V-ing."
        },
        {
            type: "Continuous",
            question: "I ___ be studying at 8 PM.",
            options: ["will", "am", "have", "did"],
            answer: "will",
            explanation: "Future Continuous memakai will be + V-ing."
        },
        {
            type: "Continuous",
            question: "Will she be ___ a book tonight?",
            options: ["read", "reads", "reading", "readed"],
            answer: "reading",
            explanation: "Question Future Continuous tetap memakai be + V-ing setelah subject."
        },
        {
            type: "Continuous",
            question: "They will not be ___ football.",
            options: ["play", "plays", "playing", "played"],
            answer: "playing",
            explanation: "Negative Future Continuous memakai will not be + V-ing."
        },
        {
            type: "Perfect Verbal",
            question: "She will have ___ dinner before you arrive.",
            options: ["eat", "eats", "eating", "eaten"],
            answer: "eaten",
            explanation: "Future Perfect memakai will have + V3."
        },
        {
            type: "Perfect Verbal",
            question: "They will have ___ the project by Monday.",
            options: ["complete", "completed", "completing", "completes"],
            answer: "completed",
            explanation: "Future Perfect memakai will have + V3."
        },
        {
            type: "Perfect Verbal",
            question: "I will not have ___ my homework by 8 PM.",
            options: ["finish", "finished", "finishing", "finishes"],
            answer: "finished",
            explanation: "Negative Future Perfect memakai will not have + V3."
        },
        {
            type: "Perfect Verbal",
            question: "___ you have finished your homework by 8 PM?",
            options: ["Do", "Did", "Will", "Have"],
            answer: "Will",
            explanation: "Question Future Perfect memakai Will + subject + have + V3."
        },
        {
            type: "Perfect Nominal",
            question: "She will have ___ busy for two hours.",
            options: ["be", "been", "being", "is"],
            answer: "been",
            explanation: "Future Perfect nominal memakai will have been + complement."
        },
        {
            type: "Perfect Nominal",
            question: "They will not have ___ students for three years.",
            options: ["be", "been", "being", "are"],
            answer: "been",
            explanation: "Negative Future Perfect nominal memakai will not have been + complement."
        },
        {
            type: "Concept",
            question: "Tenses mana yang menggunakan Subject + will be + V-ing?",
            options: ["Simple Future", "Future Continuous", "Future Perfect", "Simple Present"],
            answer: "Future Continuous",
            explanation: "Future Continuous memakai will be + V-ing."
        }
    ]
},

"past-future-tense": {
    title: "Past Future Tense",
    description: "Past Future Tense digunakan untuk membicarakan rencana, prediksi, niat, atau kejadian masa depan yang dilihat dari sudut pandang masa lampau. Dalam modul ini, kamu mempelajari Simple Past Future, Past Future Continuous, dan Past Future Perfect.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Past Future = Subject + would + V1<br>
        Past Future Continuous = Subject + would be + V-ing<br>
        Past Future Perfect = Subject + would have + V3
    `,

    notes: [
        "Simple Past Future memakai would + V1.",
        "Simple Past Future nominal memakai would be + complement.",
        "Past Future Continuous memakai would be + V-ing.",
        "Past Future Perfect memakai would have + V3.",
        "Past Future Perfect nominal memakai would have been + complement.",
        "Past Future sering digunakan dalam reported speech atau kalimat pengandaian."
    ],

    patterns: [
        {
            group: "Simple Past Future",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + would + V1",
                    examples: [
                        "I would study English.",
                        "She would visit her grandmother.",
                        "They would play football."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + would + not + V1",
                    examples: [
                        "I would not study English.",
                        "She would not visit her grandmother.",
                        "They would not play football."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Would + Subject + V1?",
                    examples: [
                        "Would you study English?",
                        "Would she visit her grandmother?",
                        "Would they play football?"
                    ]
                },
                {
                    label: "Nominal Positive",
                    formula: "Subject + would be + Complement",
                    examples: [
                        "I would be busy.",
                        "She would be a teacher.",
                        "They would be ready."
                    ]
                },
                {
                    label: "Nominal Negative",
                    formula: "Subject + would + not + be + Complement",
                    examples: [
                        "I would not be busy.",
                        "She would not be a teacher.",
                        "They would not be ready."
                    ]
                },
                {
                    label: "Nominal Question",
                    formula: "Would + Subject + be + Complement?",
                    examples: [
                        "Would you be busy?",
                        "Would she be a teacher?",
                        "Would they be ready?"
                    ]
                }
            ]
        },
        {
            group: "Past Future Continuous",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + would be + V-ing",
                    examples: [
                        "I would be studying at that time.",
                        "She would be reading a book.",
                        "They would be playing football."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + would + not + be + V-ing",
                    examples: [
                        "I would not be studying at that time.",
                        "She would not be reading a book.",
                        "They would not be playing football."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Would + Subject + be + V-ing?",
                    examples: [
                        "Would you be studying at that time?",
                        "Would she be reading a book?",
                        "Would they be playing football?"
                    ]
                }
            ]
        },
        {
            group: "Past Future Perfect",
            items: [
                {
                    label: "Verbal Positive",
                    formula: "Subject + would have + V3",
                    examples: [
                        "I would have finished my homework.",
                        "She would have eaten dinner.",
                        "They would have completed the project."
                    ]
                },
                {
                    label: "Verbal Negative",
                    formula: "Subject + would + not + have + V3",
                    examples: [
                        "I would not have finished my homework.",
                        "She would not have eaten dinner.",
                        "They would not have completed the project."
                    ]
                },
                {
                    label: "Verbal Question",
                    formula: "Would + Subject + have + V3?",
                    examples: [
                        "Would you have finished your homework?",
                        "Would she have eaten dinner?",
                        "Would they have completed the project?"
                    ]
                },
                {
                    label: "Nominal Positive",
                    formula: "Subject + would have been + Complement",
                    examples: [
                        "I would have been ready.",
                        "She would have been busy.",
                        "They would have been students."
                    ]
                },
                {
                    label: "Nominal Negative",
                    formula: "Subject + would + not + have + been + Complement",
                    examples: [
                        "I would not have been ready.",
                        "She would not have been busy.",
                        "They would not have been students."
                    ]
                },
                {
                    label: "Nominal Question",
                    formula: "Would + Subject + have + been + Complement?",
                    examples: [
                        "Would you have been ready?",
                        "Would she have been busy?",
                        "Would they have been students?"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Verbal",
            question: "She ___ visit her grandmother.",
            options: ["would", "is", "has", "did"],
            answer: "would",
            explanation: "Simple Past Future verbal memakai would + V1."
        },
        {
            type: "Simple Verbal",
            question: "They would ___ football.",
            options: ["play", "plays", "playing", "played"],
            answer: "play",
            explanation: "Setelah would, verb harus kembali ke V1."
        },
        {
            type: "Simple Verbal",
            question: "She would not ___ English.",
            options: ["studies", "studying", "study", "studied"],
            answer: "study",
            explanation: "Negative Simple Past Future memakai would not + V1."
        },
        {
            type: "Simple Verbal",
            question: "___ you study English?",
            options: ["Do", "Did", "Would", "Have"],
            answer: "Would",
            explanation: "Question Simple Past Future memakai Would + subject + V1."
        },
        {
            type: "Simple Nominal",
            question: "She would ___ a teacher.",
            options: ["is", "are", "be", "been"],
            answer: "be",
            explanation: "Simple Past Future nominal memakai would be + complement."
        },
        {
            type: "Simple Nominal",
            question: "They would ___ ready.",
            options: ["be", "are", "were", "been"],
            answer: "be",
            explanation: "Setelah would, bentuk be tetap be."
        },
        {
            type: "Simple Nominal",
            question: "She would not ___ busy.",
            options: ["is", "be", "been", "being"],
            answer: "be",
            explanation: "Negative Simple Past Future nominal memakai would not be + complement."
        },
        {
            type: "Simple Nominal",
            question: "___ they be ready?",
            options: ["Do", "Did", "Would", "Have"],
            answer: "Would",
            explanation: "Question Simple Past Future nominal memakai Would + subject + be + complement."
        },
        {
            type: "Continuous",
            question: "She would be ___ a book.",
            options: ["read", "reads", "reading", "readed"],
            answer: "reading",
            explanation: "Past Future Continuous memakai would be + V-ing."
        },
        {
            type: "Continuous",
            question: "They would be ___ football.",
            options: ["play", "plays", "playing", "played"],
            answer: "playing",
            explanation: "Past Future Continuous memakai would be + V-ing."
        },
        {
            type: "Continuous",
            question: "I ___ be studying at that time.",
            options: ["would", "am", "have", "did"],
            answer: "would",
            explanation: "Past Future Continuous memakai would be + V-ing."
        },
        {
            type: "Continuous",
            question: "Would she be ___ a book?",
            options: ["read", "reads", "reading", "readed"],
            answer: "reading",
            explanation: "Question Past Future Continuous tetap memakai be + V-ing setelah subject."
        },
        {
            type: "Continuous",
            question: "They would not be ___ football.",
            options: ["play", "plays", "playing", "played"],
            answer: "playing",
            explanation: "Negative Past Future Continuous memakai would not be + V-ing."
        },
        {
            type: "Perfect Verbal",
            question: "She would have ___ dinner.",
            options: ["eat", "eats", "eating", "eaten"],
            answer: "eaten",
            explanation: "Past Future Perfect memakai would have + V3."
        },
        {
            type: "Perfect Verbal",
            question: "They would have ___ the project.",
            options: ["complete", "completed", "completing", "completes"],
            answer: "completed",
            explanation: "Past Future Perfect memakai would have + V3."
        },
        {
            type: "Perfect Verbal",
            question: "I would not have ___ my homework.",
            options: ["finish", "finished", "finishing", "finishes"],
            answer: "finished",
            explanation: "Negative Past Future Perfect memakai would not have + V3."
        },
        {
            type: "Perfect Verbal",
            question: "___ you have finished your homework?",
            options: ["Do", "Did", "Would", "Have"],
            answer: "Would",
            explanation: "Question Past Future Perfect memakai Would + subject + have + V3."
        },
        {
            type: "Perfect Nominal",
            question: "She would have ___ busy.",
            options: ["be", "been", "being", "is"],
            answer: "been",
            explanation: "Past Future Perfect nominal memakai would have been + complement."
        },
        {
            type: "Perfect Nominal",
            question: "They would not have ___ students.",
            options: ["be", "been", "being", "are"],
            answer: "been",
            explanation: "Negative Past Future Perfect nominal memakai would not have been + complement."
        },
        {
            type: "Concept",
            question: "Tenses mana yang menggunakan Subject + would be + V-ing?",
            options: [
                "Simple Past Future",
                "Past Future Continuous",
                "Past Future Perfect",
                "Simple Past"
            ],
            answer: "Past Future Continuous",
            explanation: "Past Future Continuous memakai would be + V-ing."
        }
    ]
},

"present-passive": {
    title: "Present Passive",
    description: "Present Passive digunakan ketika fokus kalimat berada pada objek yang menerima aksi, bukan pada pelaku aksi. Dalam bentuk present, passive voice mengikuti pola be + V3 sesuai tense-nya.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Present Passive = Subject + am/is/are + V3<br>
        Present Continuous Passive = Subject + am/is/are + being + V3<br>
        Present Perfect Passive = Subject + have/has + been + V3
    `,

    notes: [
        "Passive voice digunakan saat fokus kalimat adalah penerima aksi.",
        "Object pada active voice menjadi subject pada passive voice.",
        "Verb passive selalu menggunakan V3.",
        "Simple Present Passive memakai am/is/are + V3.",
        "Present Continuous Passive memakai am/is/are + being + V3.",
        "Present Perfect Passive memakai have/has + been + V3.",
        "Pelaku aksi dapat ditambahkan dengan by, tetapi tidak selalu wajib."
    ],

    patterns: [
        {
            group: "Simple Present Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + am/is/are + V3",
                    examples: [
                        "English is spoken worldwide.",
                        "The room is cleaned every day.",
                        "The books are arranged neatly."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + am/is/are + not + V3",
                    examples: [
                        "English is not spoken here.",
                        "The room is not cleaned every day.",
                        "The books are not arranged neatly."
                    ]
                },
                {
                    label: "Question",
                    formula: "Am/Is/Are + Subject + V3?",
                    examples: [
                        "Is English spoken worldwide?",
                        "Is the room cleaned every day?",
                        "Are the books arranged neatly?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + V1(s/es) + Object → Passive: Object + am/is/are + V3",
                    examples: [
                        "Active: She writes a letter.",
                        "Passive: A letter is written by her.",
                        "Active: They clean the room.",
                        "Passive: The room is cleaned by them."
                    ]
                }
            ]
        },
        {
            group: "Present Continuous Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + am/is/are + being + V3",
                    examples: [
                        "The house is being painted.",
                        "The food is being prepared.",
                        "The rooms are being cleaned."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + am/is/are + not + being + V3",
                    examples: [
                        "The house is not being painted.",
                        "The food is not being prepared.",
                        "The rooms are not being cleaned."
                    ]
                },
                {
                    label: "Question",
                    formula: "Am/Is/Are + Subject + being + V3?",
                    examples: [
                        "Is the house being painted?",
                        "Is the food being prepared?",
                        "Are the rooms being cleaned?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + am/is/are + V-ing + Object → Passive: Object + am/is/are + being + V3",
                    examples: [
                        "Active: She is writing a letter.",
                        "Passive: A letter is being written by her.",
                        "Active: They are cleaning the rooms.",
                        "Passive: The rooms are being cleaned by them."
                    ]
                }
            ]
        },
        {
            group: "Present Perfect Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + have/has + been + V3",
                    examples: [
                        "The work has been finished.",
                        "The report has been submitted.",
                        "The letters have been sent."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + have/has + not + been + V3",
                    examples: [
                        "The work has not been finished.",
                        "The report has not been submitted.",
                        "The letters have not been sent."
                    ]
                },
                {
                    label: "Question",
                    formula: "Have/Has + Subject + been + V3?",
                    examples: [
                        "Has the work been finished?",
                        "Has the report been submitted?",
                        "Have the letters been sent?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + have/has + V3 + Object → Passive: Object + have/has + been + V3",
                    examples: [
                        "Active: She has written a letter.",
                        "Passive: A letter has been written by her.",
                        "Active: They have sent the letters.",
                        "Passive: The letters have been sent by them."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Passive",
            question: "English ___ spoken worldwide.",
            options: ["is", "are", "am", "has"],
            answer: "is",
            explanation: "Simple Present Passive memakai am/is/are + V3. Subject English memakai is."
        },
        {
            type: "Simple Passive",
            question: "The rooms ___ cleaned every day.",
            options: ["is", "are", "am", "has"],
            answer: "are",
            explanation: "Subject plural 'The rooms' memakai are + V3."
        },
        {
            type: "Simple Passive",
            question: "The letter is ___ by her.",
            options: ["write", "writes", "written", "writing"],
            answer: "written",
            explanation: "Passive voice selalu memakai V3. V3 dari write adalah written."
        },
        {
            type: "Simple Passive",
            question: "Kalimat mana yang merupakan Simple Present Passive?",
            options: [
                "She writes a letter.",
                "A letter is written by her.",
                "She is writing a letter.",
                "She has written a letter."
            ],
            answer: "A letter is written by her.",
            explanation: "Simple Present Passive memakai is/am/are + V3."
        },
        {
            type: "Simple Passive",
            question: "Active: They clean the room. Passive form is...",
            options: [
                "The room is cleaned by them.",
                "The room are cleaned by them.",
                "The room is cleaning by them.",
                "The room has cleaned by them."
            ],
            answer: "The room is cleaned by them.",
            explanation: "Object 'the room' menjadi subject, lalu memakai is + V3."
        },
        {
            type: "Continuous Passive",
            question: "The house ___ being painted.",
            options: ["is", "are", "has", "have"],
            answer: "is",
            explanation: "Present Continuous Passive memakai am/is/are + being + V3."
        },
        {
            type: "Continuous Passive",
            question: "The rooms are being ___.",
            options: ["clean", "cleans", "cleaning", "cleaned"],
            answer: "cleaned",
            explanation: "Setelah being dalam passive voice, verb harus V3."
        },
        {
            type: "Continuous Passive",
            question: "Kalimat mana yang menggunakan Present Continuous Passive?",
            options: [
                "The food is being prepared.",
                "The food is prepared.",
                "She is preparing the food.",
                "The food has been prepared."
            ],
            answer: "The food is being prepared.",
            explanation: "Present Continuous Passive memakai is/am/are + being + V3."
        },
        {
            type: "Continuous Passive",
            question: "Active: She is writing a letter. Passive form is...",
            options: [
                "A letter is written by her.",
                "A letter is being written by her.",
                "A letter has been written by her.",
                "A letter was written by her."
            ],
            answer: "A letter is being written by her.",
            explanation: "Present Continuous Passive memakai is + being + V3."
        },
        {
            type: "Continuous Passive",
            question: "The report is not being ___.",
            options: ["prepare", "prepares", "preparing", "prepared"],
            answer: "prepared",
            explanation: "Negative Present Continuous Passive tetap memakai being + V3."
        },
        {
            type: "Perfect Passive",
            question: "The work has ___ finished.",
            options: ["be", "been", "being", "is"],
            answer: "been",
            explanation: "Present Perfect Passive memakai has/have + been + V3."
        },
        {
            type: "Perfect Passive",
            question: "The letters have been ___.",
            options: ["send", "sends", "sending", "sent"],
            answer: "sent",
            explanation: "Passive voice memakai V3. V3 dari send adalah sent."
        },
        {
            type: "Perfect Passive",
            question: "Kalimat mana yang merupakan Present Perfect Passive?",
            options: [
                "The report is submitted.",
                "The report is being submitted.",
                "The report has been submitted.",
                "She has submitted the report."
            ],
            answer: "The report has been submitted.",
            explanation: "Present Perfect Passive memakai has/have been + V3."
        },
        {
            type: "Perfect Passive",
            question: "Active: She has written a letter. bentuk Passive nya adalah ...",
            options: [
                "A letter is written by her.",
                "A letter is being written by her.",
                "A letter has been written by her.",
                "A letter was written by her."
            ],
            answer: "A letter has been written by her.",
            explanation: "Present Perfect Passive memakai has been + V3."
        },
        {
            type: "Perfect Passive",
            question: "Have the letters ___ sent?",
            options: ["be", "been", "being", "are"],
            answer: "been",
            explanation: "Question Present Perfect Passive memakai Have/Has + subject + been + V3."
        },
        {
            type: "Concept",
            question: "Passive voice berfokus pada...",
            options: [
                "Penerima aksi",
                "Hanya aksi yang dilakukan",
                "Kata sifat (adjective)",
                "Kata hubung (conjunction)"
            ],
            answer: "Penerima aksi",
            explanation: "Passive voice menekankan penerima aksi."
        },
        {
            type: "Concept",
            question: "Passive voice selalu menggunakan...",
            options: ["V1", "V2", "V3", "V-ing"],
            answer: "V3",
            explanation: "Passive voice selalu memakai past participle atau V3."
        },
        {
            type: "Concept",
            question: "Kata 'by' digunakan untuk menunjukkan...",
            options: ["Pelaku aksi", "Tempat", "Waktu", "Kata sifat"],
            answer: "Pelaku aksi",
            explanation: "By digunakan untuk menunjukkan pelaku aksi dalam passive voice."
        },
        {
            type: "Transform",
            question: "Active: They prepare the food. Bentuk pasif nya adalah...",
            options: [
                "The food is prepared by them.",
                "The food are prepared by them.",
                "The food is preparing by them.",
                "The food has prepared by them."
            ],
            answer: "The food is prepared by them.",
            explanation: "Object 'the food' menjadi subject, lalu memakai is + V3."
        },
        {
            type: "Transform",
            question: "Active: They are cleaning the rooms. Bentuk pasifnya adalah...",
            options: [
                "The rooms are cleaned by them.",
                "The rooms are being cleaned by them.",
                "The rooms have been cleaned by them.",
                "The rooms were cleaned by them."
            ],
            answer: "The rooms are being cleaned by them.",
            explanation: "Present Continuous Passive memakai are being + V3."
        }
    ]
},

"past-passive": {
    title: "Past Passive",
    description: "Past Passive digunakan ketika fokus kalimat berada pada penerima aksi yang terjadi di masa lampau. Bentuk passive ini memakai was/were, was/were being, atau had been + V3 sesuai bentuk past tense-nya.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Past Passive = Subject + was/were + V3<br>
        Past Continuous Passive = Subject + was/were + being + V3<br>
        Past Perfect Passive = Subject + had + been + V3
    `,

    notes: [
        "Simple Past Passive memakai was/were + V3.",
        "Past Continuous Passive memakai was/were + being + V3.",
        "Past Perfect Passive memakai had been + V3.",
        "Object pada active voice menjadi subject pada passive voice.",
        "Verb passive selalu memakai V3.",
        "Pelaku aksi bisa ditambahkan dengan by."
    ],

    patterns: [
        {
            group: "Simple Past Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + was/were + V3",
                    examples: [
                        "The letter was written by her.",
                        "The room was cleaned yesterday.",
                        "The books were arranged neatly."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + was/were + not + V3",
                    examples: [
                        "The letter was not written by her.",
                        "The room was not cleaned yesterday.",
                        "The books were not arranged neatly."
                    ]
                },
                {
                    label: "Question",
                    formula: "Was/Were + Subject + V3?",
                    examples: [
                        "Was the letter written by her?",
                        "Was the room cleaned yesterday?",
                        "Were the books arranged neatly?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + V2 + Object → Passive: Object + was/were + V3",
                    examples: [
                        "Active: She wrote a letter.",
                        "Passive: A letter was written by her.",
                        "Active: They cleaned the rooms.",
                        "Passive: The rooms were cleaned by them."
                    ]
                }
            ]
        },
        {
            group: "Past Continuous Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + was/were + being + V3",
                    examples: [
                        "The letter was being written.",
                        "The house was being painted.",
                        "The rooms were being cleaned."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + was/were + not + being + V3",
                    examples: [
                        "The letter was not being written.",
                        "The house was not being painted.",
                        "The rooms were not being cleaned."
                    ]
                },
                {
                    label: "Question",
                    formula: "Was/Were + Subject + being + V3?",
                    examples: [
                        "Was the letter being written?",
                        "Was the house being painted?",
                        "Were the rooms being cleaned?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + was/were + V-ing + Object → Passive: Object + was/were + being + V3",
                    examples: [
                        "Active: She was writing a letter.",
                        "Passive: A letter was being written by her.",
                        "Active: They were cleaning the rooms.",
                        "Passive: The rooms were being cleaned by them."
                    ]
                }
            ]
        },
        {
            group: "Past Perfect Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + had + been + V3",
                    examples: [
                        "The work had been finished before dinner.",
                        "The report had been submitted before the meeting.",
                        "The letters had been sent before noon."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + had + not + been + V3",
                    examples: [
                        "The work had not been finished before dinner.",
                        "The report had not been submitted before the meeting.",
                        "The letters had not been sent before noon."
                    ]
                },
                {
                    label: "Question",
                    formula: "Had + Subject + been + V3?",
                    examples: [
                        "Had the work been finished before dinner?",
                        "Had the report been submitted before the meeting?",
                        "Had the letters been sent before noon?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + had + V3 + Object → Passive: Object + had been + V3",
                    examples: [
                        "Active: She had written a letter.",
                        "Passive: A letter had been written by her.",
                        "Active: They had sent the letters.",
                        "Passive: The letters had been sent by them."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Passive",
            question: "The letter ___ written by her.",
            options: ["is", "was", "were", "has"],
            answer: "was",
            explanation: "Simple Past Passive memakai was/were + V3. Subject 'The letter' memakai was."
        },
        {
            type: "Simple Passive",
            question: "The rooms ___ cleaned yesterday.",
            options: ["is", "are", "was", "were"],
            answer: "were",
            explanation: "Subject plural 'The rooms' memakai were + V3."
        },
        {
            type: "Simple Passive",
            question: "The book was ___ by John.",
            options: ["write", "writes", "written", "writing"],
            answer: "written",
            explanation: "Passive voice selalu memakai V3. V3 dari write adalah written."
        },
        {
            type: "Simple Passive",
            question: "Kalimat mana yang merupakan Simple Past Passive?",
            options: [
                "She wrote a letter.",
                "A letter was written by her.",
                "She was writing a letter.",
                "A letter had been written by her."
            ],
            answer: "A letter was written by her.",
            explanation: "Simple Past Passive memakai was/were + V3."
        },
        {
            type: "Simple Passive",
            question: "Active: They cleaned the room. Bentuk pasifnya adalah...",
            options: [
                "The room is cleaned by them.",
                "The room was cleaned by them.",
                "The room was being cleaned by them.",
                "The room had been cleaned by them."
            ],
            answer: "The room was cleaned by them.",
            explanation: "Simple Past Passive memakai was/were + V3."
        },
        {
            type: "Continuous Passive",
            question: "The house ___ being painted.",
            options: ["is", "are", "was", "has"],
            answer: "was",
            explanation: "Past Continuous Passive memakai was/were + being + V3."
        },
        {
            type: "Continuous Passive",
            question: "The rooms were being ___.",
            options: ["clean", "cleans", "cleaning", "cleaned"],
            answer: "cleaned",
            explanation: "Setelah being dalam passive voice, verb harus V3."
        },
        {
            type: "Continuous Passive",
            question: "Kalimat mana yang merupakan Past Continuous Passive?",
            options: [
                "The food was being prepared.",
                "The food was prepared.",
                "She was preparing the food.",
                "The food had been prepared."
            ],
            answer: "The food was being prepared.",
            explanation: "Past Continuous Passive memakai was/were + being + V3."
        },
        {
            type: "Continuous Passive",
            question: "Active: She was writing a letter. Bentuk pasifnya adalah...",
            options: [
                "A letter was written by her.",
                "A letter was being written by her.",
                "A letter had been written by her.",
                "A letter is written by her."
            ],
            answer: "A letter was being written by her.",
            explanation: "Past Continuous Passive memakai was/were being + V3."
        },
        {
            type: "Continuous Passive",
            question: "The report was not being ___.",
            options: ["prepare", "prepares", "preparing", "prepared"],
            answer: "prepared",
            explanation: "Negative Past Continuous Passive tetap memakai being + V3."
        },
        {
            type: "Perfect Passive",
            question: "The work had ___ finished before dinner.",
            options: ["be", "been", "being", "was"],
            answer: "been",
            explanation: "Past Perfect Passive memakai had been + V3."
        },
        {
            type: "Perfect Passive",
            question: "The letters had been ___.",
            options: ["send", "sends", "sending", "sent"],
            answer: "sent",
            explanation: "Passive voice memakai V3. V3 dari send adalah sent."
        },
        {
            type: "Perfect Passive",
            question: "Kalimat mana yang merupakan Past Perfect Passive?",
            options: [
                "The report was submitted.",
                "The report was being submitted.",
                "The report had been submitted.",
                "She had submitted the report."
            ],
            answer: "The report had been submitted.",
            explanation: "Past Perfect Passive memakai had been + V3."
        },
        {
            type: "Perfect Passive",
            question: "Active: She had written a letter. Bentuk pasifnya adalah...",
            options: [
                "A letter was written by her.",
                "A letter was being written by her.",
                "A letter had been written by her.",
                "A letter has been written by her."
            ],
            answer: "A letter had been written by her.",
            explanation: "Past Perfect Passive memakai had been + V3."
        },
        {
            type: "Perfect Passive",
            question: "Had the letters ___ sent?",
            options: ["be", "been", "being", "were"],
            answer: "been",
            explanation: "Question Past Perfect Passive memakai Had + subject + been + V3."
        },
        {
            type: "Concept",
            question: "Past Passive memakai ...",
            options: ["V1", "V2", "V3", "Hanya V-ing"],
            answer: "V3",
            explanation: "Semua passive voice memakai V3."
        },
        {
            type: "Concept",
            question: "Di passive voice, object dari kalimat aktif menjadi...",
            options: ["Subject", "Adverb", "Conjunction", "Article"],
            answer: "Subject",
            explanation: "Object pada active voice berubah menjadi subject pada passive voice."
        },
        {
            type: "Transform",
            question: "Active: They were cleaning the rooms. Bentuk pasifnya adalah...",
            options: [
                "The rooms were cleaned by them.",
                "The rooms were being cleaned by them.",
                "The rooms had been cleaned by them.",
                "The rooms are being cleaned by them."
            ],
            answer: "The rooms were being cleaned by them.",
            explanation: "Past Continuous Passive memakai were being + V3."
        },
        {
            type: "Transform",
            question: "Active: They had sent the letters. Bentuk pasifnya adalah...",
            options: [
                "The letters were sent by them.",
                "The letters were being sent by them.",
                "The letters had been sent by them.",
                "The letters have been sent by them."
            ],
            answer: "The letters had been sent by them.",
            explanation: "Past Perfect Passive memakai had been + V3."
        },
        {
            type: "Concept",
            question: "Tenses ana yang menggunakan Subject + had been + V3?",
            options: [
                "Simple Past Passive",
                "Past Continuous Passive",
                "Past Perfect Passive",
                "Present Perfect Passive"
            ],
            answer: "Past Perfect Passive",
            explanation: "Past Perfect Passive memakai had been + V3."
        }
    ]
},


"future-passive": {
    title: "Future Passive",
    description: "Future Passive digunakan ketika fokus kalimat berada pada penerima aksi yang akan terjadi di masa depan. Bentuk yang paling sering digunakan adalah Simple Future Passive dan Future Perfect Passive.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Future Passive = Subject + will be + V3<br>
        Future Perfect Passive = Subject + will have been + V3
    `,

    notes: [
        "Simple Future Passive memakai will be + V3.",
        "Future Perfect Passive memakai will have been + V3.",
        "Future Continuous Passive secara teori berbentuk will be being + V3.",
        "Namun Future Continuous Passive sangat jarang digunakan dalam Bahasa Inggris modern.",
        "Dalam penggunaan nyata, Simple Future Passive biasanya lebih natural.",
        "Passive voice selalu memakai V3.",
        "Pelaku aksi bisa ditambahkan dengan by jika diperlukan."
    ],

    patterns: [
        {
            group: "Simple Future Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + will be + V3",
                    examples: [
                        "The report will be submitted tomorrow.",
                        "The room will be cleaned tonight.",
                        "English will be taught next semester."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + will + not + be + V3",
                    examples: [
                        "The report will not be submitted tomorrow.",
                        "The room will not be cleaned tonight.",
                        "English will not be taught next semester."
                    ]
                },
                {
                    label: "Question",
                    formula: "Will + Subject + be + V3?",
                    examples: [
                        "Will the report be submitted tomorrow?",
                        "Will the room be cleaned tonight?",
                        "Will English be taught next semester?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + will + V1 + Object → Passive: Object + will be + V3",
                    examples: [
                        "Active: She will submit the report.",
                        "Passive: The report will be submitted by her.",
                        "Active: They will clean the room.",
                        "Passive: The room will be cleaned by them."
                    ]
                }
            ]
        },
        {
            group: "Future Continuous Passive",
            items: [
                {
                    label: "Rare Form",
                    formula: "Subject + will be being + V3",
                    examples: [
                        "The room will be being cleaned.",
                        "The report will be being checked."
                    ]
                },
                {
                    label: "Better Alternative",
                    formula: "Use Simple Future Passive instead",
                    examples: [
                        "The room will be cleaned.",
                        "The report will be checked."
                    ]
                },
                {
                    label: "Usage Note",
                    formula: "will be being + V3 is grammatically possible but rarely used",
                    examples: [
                        "Better: The food will be prepared soon.",
                        "Better: The project will be reviewed tomorrow."
                    ]
                }
            ]
        },
        {
            group: "Future Perfect Passive",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + will have been + V3",
                    examples: [
                        "The project will have been completed by Friday.",
                        "The report will have been submitted before noon.",
                        "The letters will have been sent before tomorrow."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + will + not + have + been + V3",
                    examples: [
                        "The project will not have been completed by Friday.",
                        "The report will not have been submitted before noon.",
                        "The letters will not have been sent before tomorrow."
                    ]
                },
                {
                    label: "Question",
                    formula: "Will + Subject + have been + V3?",
                    examples: [
                        "Will the project have been completed by Friday?",
                        "Will the report have been submitted before noon?",
                        "Will the letters have been sent before tomorrow?"
                    ]
                },
                {
                    label: "Active to Passive",
                    formula: "Active: Subject + will have + V3 + Object → Passive: Object + will have been + V3",
                    examples: [
                        "Active: She will have submitted the report.",
                        "Passive: The report will have been submitted by her.",
                        "Active: They will have completed the project.",
                        "Passive: The project will have been completed by them."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Passive",
            question: "The report ___ submitted tomorrow.",
            options: ["will be", "will", "will have", "is being"],
            answer: "will be",
            explanation: "Simple Future Passive memakai will be + V3."
        },
        {
            type: "Simple Passive",
            question: "The room will be ___.",
            options: ["clean", "cleans", "cleaning", "cleaned"],
            answer: "cleaned",
            explanation: "Passive voice selalu memakai V3. V3 dari clean adalah cleaned."
        },
        {
            type: "Simple Passive",
            question: "English will be ___ next semester.",
            options: ["teach", "teaches", "teaching", "taught"],
            answer: "taught",
            explanation: "V3 dari teach adalah taught."
        },
        {
            type: "Simple Passive",
            question: "The report will not be ___ tomorrow.",
            options: ["submit", "submits", "submitted", "submitting"],
            answer: "submitted",
            explanation: "Negative Simple Future Passive tetap memakai will not be + V3."
        },
        {
            type: "Simple Passive",
            question: "___ the room be cleaned tonight?",
            options: ["Do", "Did", "Will", "Have"],
            answer: "Will",
            explanation: "Question Simple Future Passive memakai Will + subject + be + V3."
        },
        {
            type: "Simple Passive",
            question: "Kalimat mana yang merupakan Simple Future Passive?",
            options: [
                "She will submit the report.",
                "The report will be submitted.",
                "She is submitting the report.",
                "The report has been submitted."
            ],
            answer: "The report will be submitted.",
            explanation: "Simple Future Passive memakai will be + V3."
        },
        {
            type: "Transform",
            question: "Active: They will clean the room. Bentuk pasifnya adalah...",
            options: [
                "The room will clean by them.",
                "The room will be cleaned by them.",
                "The room will have cleaned by them.",
                "The room is being cleaned by them."
            ],
            answer: "The room will be cleaned by them.",
            explanation: "Object 'the room' menjadi subject, lalu memakai will be + V3."
        },
        {
            type: "Transform",
            question: "Active: She will write a letter. Bentuk pasifnya adalah..",
            options: [
                "A letter will be written by her.",
                "A letter will written by her.",
                "A letter will have written by her.",
                "A letter is written by her."
            ],
            answer: "A letter will be written by her.",
            explanation: "Simple Future Passive memakai will be + V3."
        },
        {
            type: "Simple Passive",
            question: "The food will be ___ soon.",
            options: ["prepare", "prepares", "prepared", "preparing"],
            answer: "prepared",
            explanation: "Passive voice memakai V3."
        },
        {
            type: "Simple Passive",
            question: "The documents will ___ checked later.",
            options: ["be", "been", "being", "are"],
            answer: "be",
            explanation: "Simple Future Passive memakai will be + V3."
        },
        {
            type: "Perfect Passive",
            question: "The project will have ___ completed by Friday.",
            options: ["be", "been", "being", "is"],
            answer: "been",
            explanation: "Future Perfect Passive memakai will have been + V3."
        },
        {
            type: "Perfect Passive",
            question: "The letters will have been ___.",
            options: ["send", "sends", "sending", "sent"],
            answer: "sent",
            explanation: "Passive voice memakai V3. V3 dari send adalah sent."
        },
        {
            type: "Perfect Passive",
            question: "The report will not have been ___ before noon.",
            options: ["submit", "submits", "submitted", "submitting"],
            answer: "submitted",
            explanation: "Negative Future Perfect Passive memakai will not have been + V3."
        },
        {
            type: "Perfect Passive",
            question: "___ the project have been completed by Friday?",
            options: ["Do", "Did", "Will", "Has"],
            answer: "Will",
            explanation: "Question Future Perfect Passive memakai Will + subject + have been + V3."
        },
        {
            type: "Perfect Passive",
            question: "Kalimat mana yang merupakan Future Perfect Passive?",
            options: [
                "The project will be completed.",
                "The project will have been completed.",
                "They will complete the project.",
                "They will have completed the project."
            ],
            answer: "The project will have been completed.",
            explanation: "Future Perfect Passive memakai will have been + V3."
        },
        {
            type: "Transform",
            question: "Active: They will have completed the project. Bentuk pasifnya adalah...",
            options: [
                "The project will be completed by them.",
                "The project will have been completed by them.",
                "The project has been completed by them.",
                "The project is completed by them."
            ],
            answer: "The project will have been completed by them.",
            explanation: "Future Perfect Passive memakai will have been + V3."
        },
        {
            type: "Transform",
            question: "Active: She will have submitted the report. Bentuk pasifnya adalah...",
            options: [
                "The report will be submitted by her.",
                "The report will have been submitted by her.",
                "The report has been submitted by her.",
                "The report was submitted by her."
            ],
            answer: "The report will have been submitted by her.",
            explanation: "Future Perfect Passive memakai will have been + V3."
        },
        {
            type: "Concept",
            question: "Future Continuous Passive uses...",
            options: [
                "will be being + V3",
                "will be + V1",
                "will have + V1",
                "will + V-ing"
            ],
            answer: "will be being + V3",
            explanation: "Secara teori Future Continuous Passive memakai will be being + V3, tetapi bentuk ini sangat jarang digunakan."
        },
        {
            type: "Concept",
            question: "Dibawah ini, manakah yang lebih terlihat natural dari 'will be being cleaned'?",
            options: [
                "will be cleaned",
                "will clean",
                "will have clean",
                "will cleaning"
            ],
            answer: "will be cleaned",
            explanation: "Dalam penggunaan modern, Simple Future Passive lebih natural daripada Future Continuous Passive."
        },
        {
            type: "Concept",
            question: "Passive voice focuses on...",
            options: [
                "The receiver of the action",
                "The doer only",
                "The adjective",
                "The conjunction"
            ],
            answer: "The receiver of the action",
            explanation: "Passive voice menekankan penerima aksi."
        }
    ]
},


"modal-passive": {
    title: "Modal Passive",
    description: "Modal Passive digunakan ketika kalimat pasif memakai modal seperti can, could, may, might, must, should, have to, dan need to. Fokus kalimat tetap pada penerima aksi, bukan pelaku aksi.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Modal Passive = Subject + modal + be + V3<br>
        Semi Modal Passive = Subject + have to / need to + be + V3
    `,

    notes: [
        "Modal Passive memakai modal + be + V3.",
        "Can be + V3 digunakan untuk menyatakan sesuatu yang bisa dilakukan.",
        "Must be + V3 digunakan untuk menyatakan kewajiban kuat.",
        "Should be + V3 digunakan untuk memberi saran.",
        "May/Might be + V3 digunakan untuk kemungkinan.",
        "Have to be + V3 dan need to be + V3 juga termasuk bentuk passive yang sering dipakai.",
        "Passive voice selalu memakai V3."
    ],

    patterns: [
        {
            group: "Ability / Possibility",
            items: [
                {
                    label: "Can / Could",
                    formula: "Subject + can/could + be + V3",
                    examples: [
                        "The problem can be solved.",
                        "This task could be finished today.",
                        "The file can be downloaded."
                    ]
                },
                {
                    label: "May / Might",
                    formula: "Subject + may/might + be + V3",
                    examples: [
                        "The meeting may be postponed.",
                        "The result might be announced tomorrow.",
                        "The package may be delivered today."
                    ]
                }
            ]
        },
        {
            group: "Obligation / Advice",
            items: [
                {
                    label: "Must",
                    formula: "Subject + must + be + V3",
                    examples: [
                        "The door must be closed.",
                        "The report must be submitted today.",
                        "The rules must be followed."
                    ]
                },
                {
                    label: "Should",
                    formula: "Subject + should + be + V3",
                    examples: [
                        "The room should be cleaned.",
                        "The homework should be finished.",
                        "The message should be sent now."
                    ]
                }
            ]
        },
        {
            group: "Semi Modal Passive",
            items: [
                {
                    label: "Have To",
                    formula: "Subject + have/has to + be + V3",
                    examples: [
                        "The form has to be completed.",
                        "The documents have to be checked.",
                        "The payment has to be made today."
                    ]
                },
                {
                    label: "Need To",
                    formula: "Subject + need/needs to + be + V3",
                    examples: [
                        "The car needs to be repaired.",
                        "The data needs to be updated.",
                        "The books need to be arranged."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Can Passive",
            question: "The problem can ___ solved.",
            options: ["be", "been", "being", "is"],
            answer: "be",
            explanation: "Modal Passive memakai modal + be + V3."
        },
        {
            type: "Can Passive",
            question: "The file can be ___.",
            options: ["download", "downloads", "downloading", "downloaded"],
            answer: "downloaded",
            explanation: "Setelah can be, verb harus V3."
        },
        {
            type: "Could Passive",
            question: "This task could ___ finished today.",
            options: ["be", "been", "being", "was"],
            answer: "be",
            explanation: "Could Passive memakai could be + V3."
        },
        {
            type: "May Passive",
            question: "The meeting may be ___.",
            options: ["postpone", "postpones", "postponed", "postponing"],
            answer: "postponed",
            explanation: "May Passive memakai may be + V3."
        },
        {
            type: "Might Passive",
            question: "The result might ___ announced tomorrow.",
            options: ["be", "been", "being", "is"],
            answer: "be",
            explanation: "Might Passive memakai might be + V3."
        },
        {
            type: "Must Passive",
            question: "The door must be ___.",
            options: ["close", "closes", "closed", "closing"],
            answer: "closed",
            explanation: "Must Passive memakai must be + V3."
        },
        {
            type: "Must Passive",
            question: "The rules must ___ followed.",
            options: ["be", "been", "being", "are"],
            answer: "be",
            explanation: "Modal Passive memakai must be + V3."
        },
        {
            type: "Should Passive",
            question: "The homework should be ___.",
            options: ["finish", "finishes", "finished", "finishing"],
            answer: "finished",
            explanation: "Should Passive memakai should be + V3."
        },
        {
            type: "Should Passive",
            question: "The message should ___ sent now.",
            options: ["be", "been", "being", "is"],
            answer: "be",
            explanation: "Should Passive memakai should be + V3."
        },
        {
            type: "Have To Passive",
            question: "The form has to be ___.",
            options: ["complete", "completed", "completing", "completes"],
            answer: "completed",
            explanation: "Have to Passive memakai have/has to be + V3."
        },
        {
            type: "Have To Passive",
            question: "The documents have to ___ checked.",
            options: ["be", "been", "being", "are"],
            answer: "be",
            explanation: "Have to Passive memakai have to be + V3."
        },
        {
            type: "Need To Passive",
            question: "The car needs to be ___.",
            options: ["repair", "repairs", "repaired", "repairing"],
            answer: "repaired",
            explanation: "Need to Passive memakai need/needs to be + V3."
        },
        {
            type: "Need To Passive",
            question: "The data needs to ___ updated.",
            options: ["be", "been", "being", "is"],
            answer: "be",
            explanation: "Need to Passive memakai needs to be + V3."
        },
        {
            type: "Concept",
            question: "Modal Passive menggunakan...",
            options: [
                "modal + V1",
                "modal + be + V3",
                "modal + being + V3",
                "modal + have + V3"
            ],
            answer: "modal + be + V3",
            explanation: "Modal Passive selalu memakai modal + be + V3."
        },
        {
            type: "Concept",
            question: "Kalimat mana yang merupakan Modal Passive?",
            options: [
                "She can solve the problem.",
                "The problem can be solved.",
                "She is solving the problem.",
                "The problem has been solved."
            ],
            answer: "The problem can be solved.",
            explanation: "Can be solved adalah bentuk Modal Passive."
        },
        {
            type: "Transform",
            question: "Active: She can solve the problem. Bentuk pasifnya adalah...",
            options: [
                "The problem can solve by her.",
                "The problem can be solved by her.",
                "The problem can been solved by her.",
                "The problem is can solved by her."
            ],
            answer: "The problem can be solved by her.",
            explanation: "Object 'the problem' menjadi subject, lalu memakai can be + V3."
        },
        {
            type: "Transform",
            question: "Active: They must follow the rules. Passive form is...",
            options: [
                "The rules must follow by them.",
                "The rules must be followed by them.",
                "The rules must been followed by them.",
                "The rules are must followed by them."
            ],
            answer: "The rules must be followed by them.",
            explanation: "Must Passive memakai must be + V3."
        },
        {
            type: "Transform",
            question: "Active: You should finish the homework. Bentuk pasifnya adalah...",
            options: [
                "The homework should finish by you.",
                "The homework should be finished by you.",
                "The homework should been finished by you.",
                "The homework is should finished by you."
            ],
            answer: "The homework should be finished by you.",
            explanation: "Should Passive memakai should be + V3."
        },
        {
            type: "Concept",
            question: "Dalam 'The report must be submitted', Struktur utama pasifnya adalah...",
            options: [
                "must + V1",
                "must be + V3",
                "must have + V3",
                "must being + V3"
            ],
            answer: "must be + V3",
            explanation: "Struktur modal passive adalah modal + be + V3."
        },
        {
            type: "Concept",
            question: "Passive voice berfokus pada...",
            options: [
                "Penerima aksi",
                "Kata hubung (conjunction)",
                "Kata sifat (adjective)",
                "Kata keterangan verb (adverb)"
            ],
            answer: "The receiver of the action",
            explanation: "Passive voice berfokus pada penerima aksi."
        }
    ]
},

"can-could": {
    title: "Can & Could",
    description: "Can dan could adalah modal verbs yang digunakan untuk menyatakan kemampuan, kemungkinan, izin, atau permintaan. Can biasanya digunakan untuk situasi sekarang, sedangkan could sering digunakan untuk masa lampau atau bentuk yang lebih sopan.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Can/Could + V1<br>
        Can/Could + Subject + V1?
    `,

    notes: [
        "Can digunakan untuk kemampuan saat ini.",
        "Could digunakan untuk kemampuan di masa lampau.",
        "Can dan could selalu diikuti V1.",
        "Could terdengar lebih sopan daripada can dalam request.",
        "Can juga bisa digunakan untuk izin informal.",
        "Could juga bisa menunjukkan kemungkinan."
    ],

    patterns: [
        {
            group: "Can",
            items: [
                {
                    label: "Ability",
                    formula: "Subject + can + V1",
                    examples: [
                        "I can swim.",
                        "She can speak English.",
                        "They can solve the problem."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + cannot/can't + V1",
                    examples: [
                        "I cannot swim.",
                        "She can't speak English.",
                        "They cannot solve the problem."
                    ]
                },
                {
                    label: "Question",
                    formula: "Can + Subject + V1?",
                    examples: [
                        "Can you swim?",
                        "Can she speak English?",
                        "Can they solve the problem?"
                    ]
                }
            ]
        },
        {
            group: "Could",
            items: [
                {
                    label: "Past Ability",
                    formula: "Subject + could + V1",
                    examples: [
                        "I could swim when I was young.",
                        "She could read before school.",
                        "They could play football well."
                    ]
                },
                {
                    label: "Polite Request",
                    formula: "Could + Subject + V1?",
                    examples: [
                        "Could you help me?",
                        "Could you open the door?",
                        "Could I borrow your pen?"
                    ]
                },
                {
                    label: "Possibility",
                    formula: "Subject + could + V1",
                    examples: [
                        "It could rain tonight.",
                        "This answer could be correct.",
                        "He could arrive late."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Can",
            question: "She ___ speak English.",
            options: ["can", "cans", "can to", "can speaks"],
            answer: "can",
            explanation: "Can selalu diikuti V1 tanpa tambahan -s atau to."
        },
        {
            type: "Can",
            question: "Setelah can, kita gunakan ...",
            options: ["V1", "V2", "V-ing", "to + V1"],
            answer: "V1",
            explanation: "Modal verb can selalu diikuti base verb atau V1."
        },
        {
            type: "Can",
            question: "Kalimat manakah yang tepat?",
            options: [
                "She can speaks English.",
                "She can speak English.",
                "She cans speak English.",
                "She can to speak English."
            ],
            answer: "She can speak English.",
            explanation: "Struktur yang benar adalah subject + can + V1."
        },
        {
            type: "Could",
            question: "I ___ swim when I was young.",
            options: ["can", "could", "am", "have"],
            answer: "could",
            explanation: "Could digunakan untuk kemampuan di masa lampau."
        },
        {
            type: "Could",
            question: "Kalimat mana yang merupakan polite request?",
            options: [
                "Could you help me?",
                "You could helped me.",
                "You could helping me.",
                "Could you helps me?"
            ],
            answer: "Could you help me?",
            explanation: "Could digunakan untuk request yang lebih sopan."
        },
        {
            type: "Negative",
            question: "She ___ speak Japanese.",
            options: ["can not", "cannot", "cans not", "can to not"],
            answer: "cannot",
            explanation: "Bentuk negatif can adalah cannot atau can't."
        },
        {
            type: "Question",
            question: "___ you open the window?",
            options: ["Can", "Cans", "Do can", "Are can"],
            answer: "Can",
            explanation: "Pertanyaan dengan can memakai Can + subject + V1?"
        },
        {
            type: "Concept",
            question: "Could terdengar lebih .... daripada can",
            options: ["Sopan", "jamak", "past participle", "continuous"],
            answer: "Sopan",
            explanation: "Could sering terdengar lebih sopan daripada can."
        },
        {
            type: "Possibility",
            question: "It ___ rain tonight.",
            options: ["could", "coulds", "could to", "could raining"],
            answer: "could",
            explanation: "Could dapat digunakan untuk kemungkinan."
        },
        {
            type: "Concept",
            question: "Can and could adalah...",
            options: ["modal verbs", "nouns", "adjectives", "articles"],
            answer: "modal verbs",
            explanation: "Can dan could termasuk modal verbs."
        }
    ]
},

"may-might": {
    title: "May & Might",
    description: "May dan might adalah modal verbs yang digunakan untuk menyatakan kemungkinan, izin, atau permintaan formal. May biasanya terdengar lebih formal, sedangkan might menunjukkan kemungkinan yang lebih lemah atau tidak pasti.",

    formula: `
        <strong>Inti Materi:</strong><br>
        May/Might + V1<br>
        May + Subject + V1?
    `,

    notes: [
        "May digunakan untuk kemungkinan.",
        "Might digunakan untuk kemungkinan yang lebih lemah.",
        "May juga digunakan untuk meminta atau memberi izin secara formal.",
        "May dan might selalu diikuti V1.",
        "Tidak gunakan to setelah may atau might.",
        "Tidak tambahkan -s pada verb setelah may atau might."
    ],

    patterns: [
        {
            group: "May",
            items: [
                {
                    label: "Possibility",
                    formula: "Subject + may + V1",
                    examples: [
                        "It may rain today.",
                        "She may come late.",
                        "They may join the meeting."
                    ]
                },
                {
                    label: "Permission",
                    formula: "Subject + may + V1",
                    examples: [
                        "You may enter the room.",
                        "You may leave now.",
                        "Students may use a dictionary."
                    ]
                },
                {
                    label: "Formal Request",
                    formula: "May + Subject + V1?",
                    examples: [
                        "May I come in?",
                        "May I ask a question?",
                        "May we leave early?"
                    ]
                }
            ]
        },
        {
            group: "Might",
            items: [
                {
                    label: "Weak Possibility",
                    formula: "Subject + might + V1",
                    examples: [
                        "It might rain tonight.",
                        "She might be busy.",
                        "They might arrive late."
                    ]
                },
                {
                    label: "Uncertainty",
                    formula: "Subject + might + V1",
                    examples: [
                        "This answer might be correct.",
                        "He might know the truth.",
                        "The package might arrive tomorrow."
                    ]
                },
                {
                    label: "Polite Suggestion",
                    formula: "Subject + might + V1",
                    examples: [
                        "You might try again.",
                        "You might ask your teacher.",
                        "We might consider another option."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "May",
            question: "It ___ rain today.",
            options: ["may", "mays", "may to", "may raining"],
            answer: "may",
            explanation: "May digunakan untuk kemungkinan dan selalu diikuti V1."
        },
        {
            type: "May",
            question: "May I ___ in?",
            options: ["come", "comes", "coming", "came"],
            answer: "come",
            explanation: "Setelah may, gunakan V1."
        },
        {
            type: "May",
            question: "Kalimat mana yang tepat?",
            options: [
                "She may comes late.",
                "She may come late.",
                "She may to come late.",
                "She mays come late."
            ],
            answer: "She may come late.",
            explanation: "May + V1, tanpa -s dan tanpa to."
        },
        {
            type: "Permission",
            question: "Modal mana yang lebih formal untuk meminta izin?",
            options: ["May", "Do", "Did", "Have"],
            answer: "May",
            explanation: "May sering digunakan untuk meminta izin secara formal."
        },
        {
            type: "Might",
            question: "She ___ be busy.",
            options: ["might", "mights", "might to", "might being"],
            answer: "might",
            explanation: "Might digunakan untuk kemungkinan yang tidak pasti."
        },
        {
            type: "Might",
            question: "This answer might ___ correct.",
            options: ["be", "been", "being", "is"],
            answer: "be",
            explanation: "Setelah might, gunakan V1. Bentuk V1 dari be adalah be."
        },
        {
            type: "Concept",
            question: "Might biasanya menunjukkan...",
            options: ["weak possibility", "strong command", "past tense only", "plural noun"],
            answer: "weak possibility",
            explanation: "Might biasanya menunjukkan kemungkinan yang lebih lemah."
        },
        {
            type: "Concept",
            question: "Setelah may atau might, kita gunakan...",
            options: ["V1", "V2", "V-ing", "to + V1"],
            answer: "V1",
            explanation: "May dan might selalu diikuti base verb atau V1."
        },
        {
            type: "Request",
            question: "Kalimat mana yang merupakan permintaan formal?",
            options: [
                "May I ask a question?",
                "I may asks a question.",
                "May I asking a question?",
                "I may to ask a question."
            ],
            answer: "May I ask a question?",
            explanation: "May I + V1 digunakan untuk request formal."
        },
        {
            type: "Concept",
            question: "May and might merupakan...",
            options: ["modal verbs", "articles", "nouns", "prepositions"],
            answer: "modal verbs",
            explanation: "May dan might termasuk modal verbs."
        }
    ]
},

"should-ought-to": {
    title: "Should & Ought To",
    description: "Should dan ought to adalah modal verbs yang digunakan untuk memberi saran, nasihat, kewajiban ringan, atau menunjukkan sesuatu yang sebaiknya dilakukan. Should lebih umum digunakan, sedangkan ought to terdengar sedikit lebih formal.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Should + V1<br>
        Ought to + V1
    `,

    notes: [
        "Should digunakan untuk memberi saran atau nasihat.",
        "Ought to memiliki makna mirip dengan should.",
        "Should selalu diikuti V1.",
        "Ought selalu diikuti to + V1.",
        "Should tidak memakai to setelahnya.",
        "Should not dapat disingkat menjadi shouldn't."
    ],

    patterns: [
        {
            group: "Should",
            items: [
                {
                    label: "Advice",
                    formula: "Subject + should + V1",
                    examples: [
                        "You should study harder.",
                        "She should drink more water.",
                        "They should arrive early."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + should + not + V1",
                    examples: [
                        "You should not smoke.",
                        "She should not sleep late.",
                        "They shouldn't be rude."
                    ]
                },
                {
                    label: "Question",
                    formula: "Should + Subject + V1?",
                    examples: [
                        "Should I call him?",
                        "Should we leave now?",
                        "Should they join the class?"
                    ]
                }
            ]
        },
        {
            group: "Ought To",
            items: [
                {
                    label: "Advice",
                    formula: "Subject + ought to + V1",
                    examples: [
                        "You ought to apologize.",
                        "She ought to study more.",
                        "They ought to respect the rules."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + ought not to + V1",
                    examples: [
                        "You ought not to lie.",
                        "She ought not to ignore the problem.",
                        "They ought not to be late."
                    ]
                },
                {
                    label: "Meaning",
                    formula: "Ought to ≈ Should",
                    examples: [
                        "You should help him.",
                        "You ought to help him.",
                        "Both sentences give advice."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Should",
            question: "You ___ study harder.",
            options: ["should", "should to", "shoulds", "should studying"],
            answer: "should",
            explanation: "Should selalu diikuti V1 tanpa to."
        },
        {
            type: "Should",
            question: "Setelah should, kita gunakan...",
            options: ["V1", "V2", "V-ing", "to + V1"],
            answer: "V1",
            explanation: "Should adalah modal verb dan selalu diikuti base verb atau V1."
        },
        {
            type: "Should",
            question: "Kalimat mana yang tepat?",
            options: [
                "You should to study.",
                "You should studies.",
                "You should study.",
                "You should studying."
            ],
            answer: "You should study.",
            explanation: "Struktur benar adalah subject + should + V1."
        },
        {
            type: "Negative",
            question: "You ___ smoke.",
            options: ["should not", "should to not", "shoulds not", "should not to"],
            answer: "should not",
            explanation: "Bentuk negatif should adalah should not + V1."
        },
        {
            type: "Question",
            question: "___ I call him?",
            options: ["Should", "Do should", "Should to", "Am should"],
            answer: "Should",
            explanation: "Pertanyaan memakai Should + subject + V1?"
        },
        {
            type: "Ought To",
            question: "You ought ___ apologize.",
            options: ["to", "for", "at", "with"],
            answer: "to",
            explanation: "Ought selalu diikuti to + V1."
        },
        {
            type: "Ought To",
            question: "She ought to ___ more.",
            options: ["study", "studies", "studying", "studied"],
            answer: "study",
            explanation: "Setelah ought to, gunakan V1."
        },
        {
            type: "Concept",
            question: "Should dan ought to digunakan untuk...",
            options: ["Saran", "tempat", "warna", "kepemilikkan"],
            answer: "advice",
            explanation: "Should dan ought to digunakan untuk memberi saran atau nasihat."
        },
        {
            type: "Meaning",
            question: "Manakah yang memiliki arti yang sama dengan 'You should rest'?",
            options: [
                "You ought to rest.",
                "You are rest.",
                "You have rest.",
                "You did rest."
            ],
            answer: "You ought to rest.",
            explanation: "Ought to memiliki makna mirip dengan should."
        },
        {
            type: "Concept",
            question: "Should and ought to merupakan...",
            options: ["modal verbs", "articles", "prepositions", "nouns"],
            answer: "modal verbs",
            explanation: "Should dan ought to termasuk modal verbs."
        }
    ]
},

"must-have-to": {
    title: "Must & Have To",
    description: "Must dan have to digunakan untuk menyatakan kewajiban atau keharusan. Must biasanya berasal dari penutur (internal obligation), sedangkan have to berasal dari aturan, keadaan, atau pihak lain (external obligation).",

    formula: `
        <strong>Inti Materi:</strong><br>
        Must + V1<br>
        Have/Has To + V1
    `,

    notes: [
        "Must menyatakan kewajiban yang kuat atau berasal dari diri sendiri.",
        "Have to menyatakan kewajiban karena aturan atau keadaan.",
        "Must selalu diikuti V1.",
        "Have to berubah menjadi has to untuk he/she/it.",
        "Must tidak memiliki bentuk lampau, sehingga menggunakan had to.",
        "Don't have to berarti tidak perlu, sedangkan mustn't berarti dilarang."
    ],

    patterns: [
        {
            group: "Must",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + must + V1",
                    examples: [
                        "You must wear a helmet.",
                        "Students must study hard.",
                        "I must finish this report today."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + must not + V1",
                    examples: [
                        "You must not smoke here.",
                        "Students mustn't cheat.",
                        "You must not park here."
                    ]
                },
                {
                    label: "Question",
                    formula: "Must + Subject + V1?",
                    examples: [
                        "Must I finish this today?",
                        "Must we leave now?",
                        "Must they attend the meeting?"
                    ]
                }
            ]
        },

        {
            group: "Have To",
            items: [
                {
                    label: "Positive",
                    formula: "Subject + have/has to + V1",
                    examples: [
                        "I have to work tomorrow.",
                        "She has to wear a uniform.",
                        "They have to pay taxes."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + don't/doesn't have to + V1",
                    examples: [
                        "You don't have to come.",
                        "She doesn't have to drive today.",
                        "They don't have to pay now."
                    ]
                },
                {
                    label: "Question",
                    formula: "Do/Does + Subject + have to + V1?",
                    examples: [
                        "Do I have to finish this?",
                        "Does she have to work today?",
                        "Do they have to wear uniforms?"
                    ]
                }
            ]
        },

        {
            group: "Difference",
            items: [
                {
                    label: "Must vs Have To",
                    formula: "Internal obligation vs External obligation",
                    examples: [
                        "I must stop eating junk food. (my decision)",
                        "I have to wear a uniform. (school rule)",
                        "Employees have to wear an ID card."
                    ]
                },
                {
                    label: "Mustn't vs Don't Have To",
                    formula: "Prohibition vs No necessity",
                    examples: [
                        "You mustn't smoke here. (forbidden)",
                        "You don't have to come tomorrow. (not necessary)",
                        "They don't have to pay today."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Must",
            question: "You ___ wear a helmet.",
            options: ["must", "must to", "musts", "must wearing"],
            answer: "must",
            explanation: "Must selalu diikuti V1."
        },
        {
            type: "Must",
            question: "Setelah must kita gunakan...",
            options: ["V1", "V2", "V3", "V-ing"],
            answer: "V1",
            explanation: "Must adalah modal verb sehingga diikuti V1."
        },
        {
            type: "Have To",
            question: "She ___ wear a uniform.",
            options: ["have to", "has to", "musts", "have"],
            answer: "has to",
            explanation: "Untuk he/she/it gunakan has to."
        },
        {
            type: "Difference",
            question: "'I must study tonight' menunjukkan...",
            options: [
                "Personal obligation",
                "Past obligation",
                "Permission",
                "Possibility"
            ],
            answer: "Personal obligation",
            explanation: "Must biasanya berasal dari keputusan atau kewajiban diri sendiri."
        },
        {
            type: "Difference",
            question: "'Employees have to wear uniforms' berarti...",
            options: [
                "Company rule",
                "Personal wish",
                "Ability",
                "Suggestion"
            ],
            answer: "Company rule",
            explanation: "Have to biasanya berasal dari aturan atau keadaan."
        },
        {
            type: "Negative",
            question: "'You mustn't smoke here' berarti...",
            options: [
                "It is forbidden",
                "It isn't necessary",
                "You may smoke",
                "You can smoke later"
            ],
            answer: "It is forbidden",
            explanation: "Mustn't berarti dilarang."
        },
        {
            type: "Negative",
            question: "'You don't have to come tomorrow' berarti...",
            options: [
                "It is not necessary",
                "It is forbidden",
                "You must come",
                "You are able to come"
            ],
            answer: "It is not necessary",
            explanation: "Don't have to berarti tidak perlu."
        },
        {
            type: "Question",
            question: "___ she have to work today?",
            options: ["Do", "Does", "Has", "Musts"],
            answer: "Does",
            explanation: "Pertanyaan have to menggunakan Do/Does."
        },
        {
            type: "Question",
            question: "___ I finish this report today?",
            options: ["Must", "Do", "Does", "Have"],
            answer: "Must",
            explanation: "Pertanyaan dengan must menggunakan Must + Subject + V1."
        },
        {
            type: "Concept",
            question: "kalimat mana yang menunjukkan larangan?",
            options: [
                "You mustn't park here.",
                "You don't have to park here.",
                "You can park here.",
                "You should park here."
            ],
            answer: "You mustn't park here.",
            explanation: "Mustn't menunjukkan larangan."
        }
    ]
},

"will-would": {
    title: "Will & Would",
    description: "Will dan would adalah modal verbs yang digunakan untuk menyatakan masa depan, kemauan, janji, prediksi, permintaan sopan, kebiasaan di masa lampau, dan situasi hipotetis. Will lebih sering digunakan untuk masa depan, sedangkan would banyak digunakan pada Conditional Sentence dan Reported Speech.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Will + V1<br>
        Would + V1
    `,

    notes: [
        "Will digunakan untuk masa depan.",
        "Will digunakan untuk keputusan spontan.",
        "Will digunakan untuk janji dan prediksi.",
        "Would adalah bentuk lampau dari will pada Reported Speech.",
        "Would digunakan untuk permintaan yang lebih sopan.",
        "Would digunakan pada Conditional Sentence Type 2 dan Type 3.",
        "Setelah will maupun would selalu menggunakan V1."
    ],

    patterns: [
        {
            group: "Will",
            items: [
                {
                    label: "Future",
                    formula: "Subject + will + V1",
                    examples: [
                        "I will study tonight.",
                        "She will arrive tomorrow.",
                        "They will visit Bali next month."
                    ]
                },
                {
                    label: "Negative",
                    formula: "Subject + will not + V1",
                    examples: [
                        "I will not be late.",
                        "She won't come today.",
                        "They won't join us."
                    ]
                },
                {
                    label: "Question",
                    formula: "Will + Subject + V1?",
                    examples: [
                        "Will you come tomorrow?",
                        "Will she help us?",
                        "Will they arrive early?"
                    ]
                }
            ]
        },

        {
            group: "Would",
            items: [
                {
                    label: "Polite Request",
                    formula: "Would + Subject + V1?",
                    examples: [
                        "Would you help me?",
                        "Would you open the window?",
                        "Would you mind waiting?"
                    ]
                },
                {
                    label: "Conditional",
                    formula: "Subject + would + V1",
                    examples: [
                        "I would buy that car.",
                        "She would travel abroad.",
                        "They would help us."
                    ]
                },
                {
                    label: "Reported Speech",
                    formula: "will → would",
                    examples: [
                        "He said he would come.",
                        "She said she would call me.",
                        "They promised they would return."
                    ]
                }
            ]
        },

        {
            group: "Difference",
            items: [
                {
                    label: "Will vs Would",
                    formula: "Future vs Polite/Hypothetical",
                    examples: [
                        "I will help you.",
                        "I would help you if I had time.",
                        "Would you close the door?"
                    ]
                },
                {
                    label: "Usage",
                    formula: "Will = certainty, Would = possibility/politeness",
                    examples: [
                        "It will rain tomorrow.",
                        "It would be nice to travel there.",
                        "Would you like some coffee?"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Future",
            question: "She ___ come tomorrow.",
            options: ["will", "would", "wills", "will to"],
            answer: "will",
            explanation: "Will digunakan untuk menyatakan masa depan."
        },
        {
            type: "Future",
            question: "Setelah will, kita gunakan...",
            options: ["V1", "V2", "V3", "V-ing"],
            answer: "V1",
            explanation: "Will selalu diikuti base verb."
        },
        {
            type: "Future",
            question: "Kalimat mana yang tepat?",
            options: [
                "She will comes tomorrow.",
                "She will come tomorrow.",
                "She will coming tomorrow.",
                "She will to come tomorrow."
            ],
            answer: "She will come tomorrow.",
            explanation: "Will selalu diikuti V1."
        },
        {
            type: "Would",
            question: "___ you help me?",
            options: ["Would", "Will", "Do", "Does"],
            answer: "Would",
            explanation: "Would digunakan untuk permintaan yang sopan."
        },
        {
            type: "Would",
            question: "I ___ buy that house if I had enough money.",
            options: ["will", "would", "am", "have"],
            answer: "would",
            explanation: "Would digunakan pada Conditional Sentence."
        },
        {
            type: "Reported Speech",
            question: "He said he ___ come tomorrow.",
            options: ["will", "would", "is", "has"],
            answer: "would",
            explanation: "Dalam Reported Speech, will berubah menjadi would."
        },
        {
            type: "Concept",
            question: "modal manakah yang sopan?",
            options: ["Would", "Will", "Can", "Must"],
            answer: "Would",
            explanation: "Would terdengar lebih sopan daripada will."
        },
        {
            type: "Concept",
            question: "Will digunakan untuk...",
            options: [
                "Aksi masa depan",
                "Aksi masa lampau",
                "Kebiasaan masa lampau",
                "Present perfect"
            ],
            answer: "Aksi masa depan",
            explanation: "Will digunakan untuk masa depan."
        },
        {
            type: "Concept",
            question: "Would digunakan dalam...",
            options: [
                "Conditional Sentence",
                "Passive Voice only",
                "Present Perfect only",
                "Gerund"
            ],
            answer: "Conditional Sentence",
            explanation: "Would merupakan modal utama dalam Conditional Sentence."
        },
        {
            type: "Difference",
            question: "Kalimat manakah yang menunjukkan future plan?",
            options: [
                "I will call you tonight.",
                "I would call you if I had your number.",
                "Would you help me?",
                "He said he would come."
            ],
            answer: "I will call you tonight.",
            explanation: "Will digunakan untuk menyatakan rencana atau tindakan di masa depan."
        }
    ]
},

"modal-review": {
    title: "Modal Review",
    description: "Modal Review adalah rangkuman akhir untuk menguji pemahaman semua modal verbs: can, could, may, might, should, ought to, must, have to, will, dan would.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Modal + V1<br>
        Semi Modal + to + V1
    `,

    notes: [
        "Can dan could berhubungan dengan kemampuan, izin, dan permintaan.",
        "May dan might berhubungan dengan kemungkinan dan izin formal.",
        "Should dan ought to digunakan untuk saran atau nasihat.",
        "Must dan have to digunakan untuk kewajiban.",
        "Mustn't berarti dilarang.",
        "Don't have to berarti tidak perlu.",
        "Will digunakan untuk masa depan.",
        "Would digunakan untuk permintaan sopan, conditional, dan reported speech."
    ],

    patterns: [
        {
            group: "Core Modal",
            items: [
                {
                    label: "Ability",
                    formula: "can/could + V1",
                    examples: [
                        "I can swim.",
                        "She could read when she was five.",
                        "Can you help me?"
                    ]
                },
                {
                    label: "Possibility",
                    formula: "may/might/could + V1",
                    examples: [
                        "It may rain.",
                        "She might be busy.",
                        "This answer could be correct."
                    ]
                },
                {
                    label: "Advice",
                    formula: "should/ought to + V1",
                    examples: [
                        "You should rest.",
                        "She ought to apologize.",
                        "They should study harder."
                    ]
                }
            ]
        },
        {
            group: "Obligation",
            items: [
                {
                    label: "Must",
                    formula: "must + V1",
                    examples: [
                        "You must follow the rules.",
                        "Students must wear uniforms.",
                        "You must not smoke here."
                    ]
                },
                {
                    label: "Have To",
                    formula: "have/has to + V1",
                    examples: [
                        "I have to work tomorrow.",
                        "She has to wear a uniform.",
                        "They don't have to come."
                    ]
                }
            ]
        },
        {
            group: "Future & Hypothetical",
            items: [
                {
                    label: "Will",
                    formula: "will + V1",
                    examples: [
                        "I will call you tonight.",
                        "She will arrive tomorrow.",
                        "They will help us."
                    ]
                },
                {
                    label: "Would",
                    formula: "would + V1",
                    examples: [
                        "Would you help me?",
                        "I would buy it if I had money.",
                        "He said he would come."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Can/Could",
            question: "She ___ speak English fluently.",
            options: ["can", "cans", "can to", "can speaking"],
            answer: "can",
            explanation: "Can selalu diikuti V1."
        },
        {
            type: "Can/Could",
            question: "I ___ swim when I was young.",
            options: ["can", "could", "must", "will"],
            answer: "could",
            explanation: "Could digunakan untuk kemampuan di masa lampau."
        },
        {
            type: "May/Might",
            question: "It ___ rain tonight.",
            options: ["might", "mustn't", "has to", "ought"],
            answer: "might",
            explanation: "Might menunjukkan kemungkinan yang tidak pasti."
        },
        {
            type: "May/Might",
            question: "___ I ask a question?",
            options: ["May", "Have", "Mustn't", "Ought"],
            answer: "May",
            explanation: "May digunakan untuk permintaan izin secara formal."
        },
        {
            type: "Should",
            question: "You ___ drink more water.",
            options: ["should", "should to", "shoulds", "should drinking"],
            answer: "should",
            explanation: "Should digunakan untuk saran."
        },
        {
            type: "Ought To",
            question: "She ought ___ apologize.",
            options: ["to", "for", "at", "with"],
            answer: "to",
            explanation: "Ought selalu diikuti to + V1."
        },
        {
            type: "Must",
            question: "You ___ not smoke here.",
            options: ["must", "have", "may", "will"],
            answer: "must",
            explanation: "Must not berarti dilarang."
        },
        {
            type: "Have To",
            question: "She ___ wear a uniform.",
            options: ["have to", "has to", "musts", "have"],
            answer: "has to",
            explanation: "Untuk subject She gunakan has to."
        },
        {
            type: "Meaning",
            question: "'You don't have to come tomorrow' berarti...",
            options: [
                "It is not necessary",
                "It is forbidden",
                "You must come",
                "You cannot come"
            ],
            answer: "It is not necessary",
            explanation: "Don't have to berarti tidak perlu."
        },
        {
            type: "Meaning",
            question: "'You mustn't park here' berarti...",
            options: [
                "It is forbidden",
                "It is optional",
                "It is possible",
                "It is recommended"
            ],
            answer: "It is forbidden",
            explanation: "Mustn't berarti dilarang."
        },
        {
            type: "Will",
            question: "She ___ call you tonight.",
            options: ["will", "would", "has", "did"],
            answer: "will",
            explanation: "Will digunakan untuk masa depan."
        },
        {
            type: "Would",
            question: "___ you help me, please?",
            options: ["Would", "Will", "Do", "Has"],
            answer: "Would",
            explanation: "Would digunakan untuk permintaan yang lebih sopan."
        },
        {
            type: "Would",
            question: "I ___ buy that car if I had enough money.",
            options: ["will", "would", "can", "must"],
            answer: "would",
            explanation: "Would digunakan dalam conditional sentence."
        },
        {
            type: "Reported Speech",
            question: "He said he ___ come later.",
            options: ["will", "would", "is", "has"],
            answer: "would",
            explanation: "Dalam reported speech, will berubah menjadi would."
        },
        {
            type: "Concept",
            question: "Setelah modal verbs, kita gunakan...",
            options: ["V1", "V2", "V3", "V-ing"],
            answer: "V1",
            explanation: "Sebagian besar modal diikuti base verb atau V1."
        },
        {
            type: "Concept",
            question: "Manakah yang merupakan semi-modal?",
            options: ["have to", "can", "may", "will"],
            answer: "have to",
            explanation: "Have to disebut semi-modal karena polanya berbeda dan berubah mengikuti subject."
        },
        {
            type: "Concept",
            question: "Modal manakah yang memberikan saran (advice)?",
            options: ["should", "mustn't", "will", "may"],
            answer: "should",
            explanation: "Should digunakan untuk memberi saran."
        },
        {
            type: "Concept",
            question: "Modal manakah yang menunjukkan kewajiban kuat?",
            options: ["must", "might", "could", "would"],
            answer: "must",
            explanation: "Must menunjukkan kewajiban kuat."
        },
        {
            type: "Concept",
            question: "Modal manakah yang menunjukkam kemungkinan yang lemah?",
            options: ["might", "must", "should", "have to"],
            answer: "might",
            explanation: "Might menunjukkan kemungkinan yang lemah."
        },
        {
            type: "Concept",
            question: "Modal manakah yang digunakan untuk permintaan yang sopan?",
            options: ["would", "must", "has to", "mustn't"],
            answer: "would",
            explanation: "Would sering digunakan untuk permintaan yang sopan."
        },
        {
            type: "Error Check",
            question: "Kalimat manakah yang tepat?",
            options: [
                "She can speaks English.",
                "She can speak English.",
                "She can to speak English.",
                "She cans speak English."
            ],
            answer: "She can speak English.",
            explanation: "Can + V1 tanpa -s dan tanpa to."
        },
        {
            type: "Error Check",
            question: "Kalimat manakah yang tepat?",
            options: [
                "You should to rest.",
                "You should rests.",
                "You should rest.",
                "You should resting."
            ],
            answer: "You should rest.",
            explanation: "Should + V1."
        },
        {
            type: "Error Check",
            question: "Kalimat manakah yang tepat?",
            options: [
                "She has to wear a uniform.",
                "She have to wears a uniform.",
                "She has wear a uniform.",
                "She must to wear a uniform."
            ],
            answer: "She has to wear a uniform.",
            explanation: "Untuk She gunakan has to + V1."
        },
        {
            type: "Meaning",
            question: "Kalimat manakah yang berarti 'not necessary' (tidak perlu)?",
            options: [
                "You don't have to pay now.",
                "You mustn't pay now.",
                "You can't pay now.",
                "You shouldn't pay now."
            ],
            answer: "You don't have to pay now.",
            explanation: "Don't have to berarti tidak perlu."
        },
        {
            type: "Meaning",
            question: "Kalimat mana yang berarti dilarang 'forbidden'?",
            options: [
                "You mustn't enter this room.",
                "You don't have to enter this room.",
                "You may enter this room.",
                "You should enter this room."
            ],
            answer: "You mustn't enter this room.",
            explanation: "Mustn't berarti dilarang."
        },
        {
            type: "Review",
            question: "Manakah pasangan yang sama/mendekati artinya?",
            options: [
                "should / ought to",
                "mustn't / don't have to",
                "will / must",
                "may / have to"
            ],
            answer: "should / ought to",
            explanation: "Should dan ought to sama-sama memberi saran."
        },
        {
            type: "Review",
            question: "Modal mana yang dipakai untuk izin formal?",
            options: ["may", "must", "would", "has to"],
            answer: "may",
            explanation: "May sering dipakai untuk izin formal."
        },
        {
            type: "Review",
            question: "Modal mana yang digunakan untuk kemampuan di masa lampau (past ability)?",
            options: ["could", "can", "must", "will"],
            answer: "could",
            explanation: "Could dapat digunakan untuk kemampuan di masa lampau."
        },
        {
            type: "Review",
            question: "Modal mana yang digunakan untuk prediksi masa depan?",
            options: ["will", "could", "mustn't", "ought to"],
            answer: "will",
            explanation: "Will digunakan untuk prediksi masa depan."
        },
        {
            type: "Review",
            question: "Modal mana yang digunakan untuk kewajiban kuat",
            options: ["must", "might", "would", "may"],
            answer: "must",
            explanation: "Must menunjukkan kewajiban kuat."
        }
    ]
},

"gerund": {
    title: "Gerund",
    description: "Gerund adalah bentuk verb yang ditambah -ing tetapi berfungsi sebagai noun. Gerund dapat menjadi subject, object, complement, atau muncul setelah preposition.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Gerund = Verb + ing sebagai noun<br>
        swimming, reading, studying, writing
    `,

    notes: [
        "Gerund berbentuk V-ing.",
        "Gerund berfungsi seperti noun.",
        "Gerund dapat menjadi subject kalimat.",
        "Gerund dapat menjadi object setelah verb tertentu.",
        "Gerund dapat muncul setelah preposition.",
        "Gerund berbeda dari Present Continuous karena gerund berfungsi sebagai noun."
    ],

    patterns: [
        {
            group: "Function",
            items: [
                {
                    label: "Subject",
                    formula: "Gerund + Verb + Complement",
                    examples: [
                        "Swimming is fun.",
                        "Reading improves vocabulary.",
                        "Studying English takes time."
                    ]
                },
                {
                    label: "Object",
                    formula: "Subject + Verb + Gerund",
                    examples: [
                        "I enjoy reading.",
                        "She likes swimming.",
                        "They avoid smoking."
                    ]
                },
                {
                    label: "After Preposition",
                    formula: "Preposition + Gerund",
                    examples: [
                        "She is good at singing.",
                        "I am interested in learning English.",
                        "He left without saying goodbye."
                    ]
                }
            ]
        },
        {
            group: "Common Gerund Verbs",
            items: [
                {
                    label: "Enjoy / Avoid / Finish",
                    formula: "Verb + Gerund",
                    examples: [
                        "I enjoy cooking.",
                        "She avoids eating junk food.",
                        "They finished working."
                    ]
                },
                {
                    label: "Mind / Keep / Practice",
                    formula: "Verb + Gerund",
                    examples: [
                        "Do you mind waiting?",
                        "He keeps trying.",
                        "We practice speaking English."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Gerund berbentuk...",
            options: ["V1", "V2", "V3", "Verb + ing"],
            answer: "Verb + ing",
            explanation: "Gerund berbentuk verb + ing dan berfungsi sebagai noun."
        },
        {
            type: "Function",
            question: "Di 'Swimming is fun', 'Swimming' adalah...",
            options: ["Gerund", "Adjective", "Conjunction", "Preposition"],
            answer: "Gerund",
            explanation: "Swimming berbentuk V-ing dan berfungsi sebagai subject."
        },
        {
            type: "Subject",
            question: "WKalimat mana yang menggunakan gerund sebagai subject?",
            options: [
                "Reading is useful.",
                "She is reading.",
                "They read books.",
                "The book is red."
            ],
            answer: "Reading is useful.",
            explanation: "Reading menjadi subject kalimat."
        },
        {
            type: "Object",
            question: "I enjoy ___.",
            options: ["read", "reads", "reading", "to reading"],
            answer: "reading",
            explanation: "Enjoy diikuti gerund."
        },
        {
            type: "Object",
            question: "She avoids ___ junk food.",
            options: ["eat", "eats", "eating", "to eat"],
            answer: "eating",
            explanation: "Avoid diikuti gerund."
        },
        {
            type: "After Preposition",
            question: "She is good at ___.",
            options: ["sing", "sings", "singing", "to sing"],
            answer: "singing",
            explanation: "Setelah preposition at, gunakan gerund."
        },
        {
            type: "After Preposition",
            question: "I am interested in ___ English.",
            options: ["learn", "learns", "learning", "to learn"],
            answer: "learning",
            explanation: "Setelah preposition in, gunakan gerund."
        },
        {
            type: "Compare",
            question: "Kalimat mana yang mengandung gerund?",
            options: [
                "She is studying.",
                "Studying is important.",
                "They are playing.",
                "I am reading."
            ],
            answer: "Studying is important.",
            explanation: "Studying berfungsi sebagai subject, jadi itu gerund."
        },
        {
            type: "Verb Pattern",
            question: "They finished ___.",
            options: ["work", "works", "working", "to working"],
            answer: "working",
            explanation: "Finish diikuti gerund."
        },
        {
            type: "Verb Pattern",
            question: "We practice ___ English.",
            options: ["speak", "speaks", "speaking", "to speak"],
            answer: "speaking",
            explanation: "Practice diikuti gerund."
        }
    ]
},

"infinitive": {
    title: "Infinitive",
    description: "Infinitive adalah bentuk dasar verb yang biasanya diawali dengan 'to'. Infinitive dapat berfungsi sebagai noun, adjective, atau adverb dalam kalimat.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Infinitive = to + V1<br>
        to study, to read, to swim
    `,

    notes: [
        "Infinitive berbentuk to + V1.",
        "Infinitive dapat menjadi subject kalimat.",
        "Infinitive dapat menjadi object setelah verb tertentu.",
        "Infinitive digunakan untuk menunjukkan tujuan (purpose).",
        "Infinitive juga dapat menjelaskan noun atau adjective.",
        "Jangan bingung dengan modal verbs karena modal memakai V1 tanpa 'to'."
    ],

    patterns: [
        {
            group: "Function",
            items: [
                {
                    label: "Subject",
                    formula: "To + V1 + Verb",
                    examples: [
                        "To travel is exciting.",
                        "To study every day is important.",
                        "To exercise is healthy."
                    ]
                },
                {
                    label: "Object",
                    formula: "Subject + Verb + to + V1",
                    examples: [
                        "I want to sleep.",
                        "She hopes to pass the exam.",
                        "They decided to leave."
                    ]
                },
                {
                    label: "Purpose",
                    formula: "Subject + Verb + to + V1",
                    examples: [
                        "I study to get good grades.",
                        "She works to earn money.",
                        "He exercises to stay healthy."
                    ]
                }
            ]
        },
        {
            group: "Common Infinitive Verbs",
            items: [
                {
                    label: "Want / Hope / Decide",
                    formula: "Verb + to + V1",
                    examples: [
                        "I want to eat.",
                        "She hopes to win.",
                        "They decided to stay."
                    ]
                },
                {
                    label: "Plan / Promise / Learn",
                    formula: "Verb + to + V1",
                    examples: [
                        "We plan to travel.",
                        "He promised to help.",
                        "She learned to drive."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Apa bentuk infinitive?",
            options: [
                "Verb + ing",
                "to + V1",
                "V2",
                "V3"
            ],
            answer: "to + V1",
            explanation: "Infinitive berbentuk to + V1."
        },
        {
            type: "Subject",
            question: "Kalimat mana yang menggunakan infinitive sebagai subject?",
            options: [
                "To travel is exciting.",
                "She is traveling.",
                "They travel often.",
                "Traveling is exciting."
            ],
            answer: "To travel is exciting.",
            explanation: "To travel menjadi subject kalimat."
        },
        {
            type: "Object",
            question: "I want ___ English.",
            options: [
                "study",
                "studying",
                "to study",
                "studied"
            ],
            answer: "to study",
            explanation: "Want diikuti infinitive."
        },
        {
            type: "Object",
            question: "She decided ___ home.",
            options: [
                "go",
                "going",
                "to go",
                "gone"
            ],
            answer: "to go",
            explanation: "Decide diikuti infinitive."
        },
        {
            type: "Purpose",
            question: "I exercise ___ healthy.",
            options: [
                "stay",
                "staying",
                "to stay",
                "stayed"
            ],
            answer: "to stay",
            explanation: "Infinitive dapat menunjukkan tujuan."
        },
        {
            type: "Verb Pattern",
            question: "They hope ___ the competition.",
            options: [
                "win",
                "winning",
                "to win",
                "won"
            ],
            answer: "to win",
            explanation: "Hope diikuti infinitive."
        },
        {
            type: "Verb Pattern",
            question: "We plan ___ abroad.",
            options: [
                "travel",
                "traveling",
                "to travel",
                "traveled"
            ],
            answer: "to travel",
            explanation: "Plan diikuti infinitive."
        },
        {
            type: "Compare",
            question: "Kalimat mana yang mengandung infinitive?",
            options: [
                "She enjoys reading.",
                "To learn English is useful.",
                "Swimming is fun.",
                "He is running."
            ],
            answer: "To learn English is useful.",
            explanation: "To learn adalah infinitive."
        },
        {
            type: "Concept",
            question: "Setelah 'want', kita biasanya menggunakan...",
            options: [
                "Gerund",
                "Infinitive",
                "V2",
                "V3"
            ],
            answer: "Infinitive",
            explanation: "Want hampir selalu diikuti infinitive."
        },
        {
            type: "Concept",
            question: "Dibawah ini, verb mana yang diikuti infinitive?",
            options: [
                "Enjoy",
                "Avoid",
                "Want",
                "Keep"
            ],
            answer: "Want",
            explanation: "Want termasuk kelompok verb yang diikuti infinitive."
        }
    ]
},

"gerund-vs-infinitive": {
    title: "Gerund vs Infinitive",
    description: "Gerund dan infinitive sama-sama berasal dari verb, tetapi penggunaannya berbeda. Beberapa verb hanya diikuti gerund, beberapa hanya infinitive, dan beberapa dapat menggunakan keduanya dengan atau tanpa perubahan makna.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Gerund = Verb + ing<br>
        Infinitive = to + Verb (V1)
    `,

    notes: [
        "Gerund berfungsi sebagai noun dalam bentuk Verb + ing.",
        "Infinitive berbentuk to + V1.",
        "Beberapa verb hanya diikuti gerund.",
        "Beberapa verb hanya diikuti infinitive.",
        "Ada verb yang bisa memakai keduanya.",
        "Sebagian verb berubah makna jika memakai gerund atau infinitive."
    ],

    patterns: [
        {
            group: "Gerund Only",
            items: [
                {
                    label: "Enjoy / Finish / Avoid",
                    formula: "Verb + Gerund",
                    examples: [
                        "I enjoy reading.",
                        "She finished cooking.",
                        "They avoid smoking."
                    ]
                },
                {
                    label: "Mind / Keep / Practice",
                    formula: "Verb + Gerund",
                    examples: [
                        "Do you mind waiting?",
                        "He keeps talking.",
                        "We practice speaking English."
                    ]
                }
            ]
        },
        {
            group: "Infinitive Only",
            items: [
                {
                    label: "Want / Decide / Hope",
                    formula: "Verb + to + V1",
                    examples: [
                        "I want to sleep.",
                        "She decided to leave.",
                        "They hope to win."
                    ]
                },
                {
                    label: "Plan / Promise / Learn",
                    formula: "Verb + to + V1",
                    examples: [
                        "We plan to travel.",
                        "He promised to help.",
                        "She learned to drive."
                    ]
                }
            ]
        },
        {
            group: "Both",
            items: [
                {
                    label: "Like / Love / Hate",
                    formula: "Verb + Gerund / Infinitive",
                    examples: [
                        "I like swimming.",
                        "I like to swim.",
                        "Both are generally acceptable."
                    ]
                },
                {
                    label: "Begin / Start / Continue",
                    formula: "Verb + Gerund / Infinitive",
                    examples: [
                        "She started reading.",
                        "She started to read.",
                        "Both forms are correct."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Gerund",
            question: "I enjoy ___.",
            options: ["read", "reading", "to read", "reads"],
            answer: "reading",
            explanation: "Enjoy selalu diikuti gerund."
        },
        {
            type: "Gerund",
            question: "They avoid ___.",
            options: ["drive", "driving", "to drive", "drove"],
            answer: "driving",
            explanation: "Avoid selalu diikuti gerund."
        },
        {
            type: "Infinitive",
            question: "She wants ___ abroad.",
            options: ["travel", "traveling", "to travel", "traveled"],
            answer: "to travel",
            explanation: "Want diikuti infinitive."
        },
        {
            type: "Infinitive",
            question: "We decided ___ early.",
            options: ["leave", "leaving", "to leave", "left"],
            answer: "to leave",
            explanation: "Decide diikuti infinitive."
        },
        {
            type: "Both",
            question: "Verb yang bisa diikuti oleh gerund maupun infinitive?",
            options: ["Like", "Enjoy", "Avoid", "Finish"],
            answer: "Like",
            explanation: "Like dapat diikuti gerund maupun infinitive."
        },
        {
            type: "Both",
            question: "She started ___ English yesterday.",
            options: ["study", "studying", "to study", "Both B and C"],
            answer: "Both B and C",
            explanation: "Start dapat diikuti gerund maupun infinitive."
        },
        {
            type: "Concept",
            question: "Gerund adalah...",
            options: [
                "Verb + ing",
                "to + V1",
                "V2",
                "V3"
            ],
            answer: "Verb + ing",
            explanation: "Gerund berbentuk verb + ing."
        },
        {
            type: "Concept",
            question: "Infinitive is...",
            options: [
                "Verb + ing",
                "to + V1",
                "V2",
                "V3"
            ],
            answer: "to + V1",
            explanation: "Infinitive berbentuk to + V1."
        },
        {
            type: "Comparison",
            question: "Kalimat mana yang tepat?",
            options: [
                "I enjoy to swim.",
                "I enjoy swimming.",
                "I enjoy swim.",
                "I enjoy swam."
            ],
            answer: "I enjoy swimming.",
            explanation: "Enjoy hanya diikuti gerund."
        },
        {
            type: "Comparison",
            question: "Kalimat mana yang tepat?",
            options: [
                "She wants going home.",
                "She wants to go home.",
                "She wants go home.",
                "She wants went home."
            ],
            answer: "She wants to go home.",
            explanation: "Want hanya diikuti infinitive."
        }
    ]
},

"verb-gerund": {
    title: "Verb + Gerund",
    description: "Beberapa verb dalam Bahasa Inggris harus selalu diikuti oleh gerund (Verb + ing). Menggunakan infinitive setelah verb-verb ini akan menyebabkan kalimat menjadi tidak gramatikal.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subject + Verb + Gerund (V-ing)
    `,

    notes: [
        "Setelah verb tertentu wajib menggunakan gerund.",
        "Jangan gunakan 'to + V1' setelah verb-verb ini.",
        "Gerund tetap berfungsi sebagai noun.",
        "Kelompok verb ini sangat sering muncul pada soal TOEFL dan TOEIC.",
        "Cara terbaik menguasainya adalah menghafal daftar verb-nya."
    ],

    patterns: [
        {
            group: "Preference",
            items: [
                {
                    label: "Enjoy / Love / Like / Prefer",
                    formula: "Verb + Gerund",
                    examples: [
                        "I enjoy reading books.",
                        "She loves cooking.",
                        "They prefer walking to school."
                    ]
                }
            ]
        },

        {
            group: "Finish Activity",
            items: [
                {
                    label: "Finish / Stop / Quit",
                    formula: "Verb + Gerund",
                    examples: [
                        "She finished writing.",
                        "He quit smoking.",
                        "They stopped arguing."
                    ]
                }
            ]
        },

        {
            group: "Avoidance",
            items: [
                {
                    label: "Avoid / Escape / Miss",
                    formula: "Verb + Gerund",
                    examples: [
                        "I avoid driving at night.",
                        "She missed meeting us.",
                        "He escaped being caught."
                    ]
                }
            ]
        },

        {
            group: "Mental Activity",
            items: [
                {
                    label: "Consider / Imagine / Suggest",
                    formula: "Verb + Gerund",
                    examples: [
                        "We considered moving.",
                        "She suggested eating outside.",
                        "Imagine living in Japan."
                    ]
                }
            ]
        },

        {
            group: "Continuation",
            items: [
                {
                    label: "Keep / Continue / Practice",
                    formula: "Verb + Gerund",
                    examples: [
                        "Keep smiling.",
                        "Continue studying.",
                        "Practice speaking English."
                    ]
                }
            ]
        },

        {
            group: "Tolerance",
            items: [
                {
                    label: "Mind / Can't Stand",
                    formula: "Verb + Gerund",
                    examples: [
                        "Do you mind waiting?",
                        "I can't stand lying.",
                        "She doesn't mind helping."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type:"Preference",
            question:"I enjoy ____ books.",
            options:["read","reading","to read","reads"],
            answer:"reading",
            explanation:"Enjoy selalu diikuti gerund."
        },
        {
            type:"Preference",
            question:"She loves ____.",
            options:["cook","cooking","to cook","cooked"],
            answer:"cooking",
            explanation:"Love dapat diikuti gerund."
        },
        {
            type:"Finish",
            question:"He finished ___.",
            options:["write","writing","to write","written"],
            answer:"writing",
            explanation:"Finish selalu diikuti gerund."
        },
        {
            type:"Finish",
            question:"They quit ___.",
            options:["smoke","smoking","to smoke","smoked"],
            answer:"smoking",
            explanation:"Quit selalu diikuti gerund."
        },
        {
            type:"Avoidance",
            question:"I avoid ___ at night.",
            options:["drive","driving","to drive","drove"],
            answer:"driving",
            explanation:"Avoid selalu diikuti gerund."
        },
        {
            type:"Mental",
            question:"She suggested ___ outside.",
            options:["eat","eating","to eat","ate"],
            answer:"eating",
            explanation:"Suggest diikuti gerund."
        },
        {
            type:"Mental",
            question:"Imagine ___ on the moon.",
            options:["live","living","to live","lived"],
            answer:"living",
            explanation:"Imagine diikuti gerund."
        },
        {
            type:"Continuation",
            question:"Keep ___.",
            options:["try","trying","to try","tried"],
            answer:"trying",
            explanation:"Keep diikuti gerund."
        },
        {
            type:"Continuation",
            question:"We practice ___ English.",
            options:["speak","speaking","to speak","spoken"],
            answer:"speaking",
            explanation:"Practice diikuti gerund."
        },
        {
            type:"Tolerance",
            question:"Do you mind ___?",
            options:["wait","waiting","to wait","waited"],
            answer:"waiting",
            explanation:"Mind diikuti gerund."
        },
        {
            type:"Tolerance",
            question:"I can't stand ___.",
            options:["lie","lying","to lie","lied"],
            answer:"lying",
            explanation:"Can't stand selalu diikuti gerund."
        },
        {
            type:"Concept",
            question:"Verb mana dibawah ini yang selalu diikuti oleh gerund?",
            options:["Enjoy","Want","Decide","Hope"],
            answer:"Enjoy",
            explanation:"Enjoy termasuk verb yang wajib diikuti gerund."
        },
        {
            type:"Concept",
            question:"Which sentence is correct?",
            options:[
                "She enjoys to swim.",
                "She enjoys swimming.",
                "She enjoys swim.",
                "She enjoys swam."
            ],
            answer:"She enjoys swimming.",
            explanation:"Enjoy + Gerund."
        },
        {
            type:"Concept",
            question:"Which sentence is correct?",
            options:[
                "He suggested eating outside.",
                "He suggested to eat outside.",
                "He suggested eat outside.",
                "He suggested ate outside."
            ],
            answer:"He suggested eating outside.",
            explanation:"Suggest diikuti gerund."
        },
        {
            type:"Concept",
            question:"After 'practice', use...",
            options:["Gerund","Infinitive","V2","V3"],
            answer:"Gerund",
            explanation:"Practice selalu diikuti gerund."
        },
        {
            type:"Concept",
            question:"After 'avoid', use...",
            options:["Gerund","Infinitive","V2","V3"],
            answer:"Gerund",
            explanation:"Avoid selalu diikuti gerund."
        },
        {
            type:"Concept",
            question:"After 'keep', use...",
            options:["Gerund","Infinitive","V2","V3"],
            answer:"Gerund",
            explanation:"Keep diikuti gerund."
        },
        {
            type:"Concept",
            question:"After 'mind', use...",
            options:["Gerund","Infinitive","V2","V3"],
            answer:"Gerund",
            explanation:"Mind diikuti gerund."
        },
        {
            type:"Review",
            question:"Which sentence is grammatically correct?",
            options:[
                "They avoided talking.",
                "They avoided to talk.",
                "They avoided talk.",
                "They avoided talked."
            ],
            answer:"They avoided talking.",
            explanation:"Avoid + Gerund."
        },
        {
            type:"Review",
            question:"Verb + Gerund means...",
            options:[
                "Verb diikuti V-ing",
                "Verb diikuti to + V1",
                "Verb diikuti V2",
                "Verb diikuti V3"
            ],
            answer:"Verb diikuti V-ing",
            explanation:"Kelompok verb ini selalu diikuti gerund."
        }
    ]
},

"verb-infinitive": {
    title: "Verb + Infinitive",
    description: "Beberapa verb dalam Bahasa Inggris harus diikuti oleh infinitive (to + Verb). Menggunakan gerund setelah verb-verb ini akan membuat kalimat menjadi tidak tepat secara grammar.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subject + Verb + to + V1
    `,

    notes: [
        "Infinitive berbentuk to + V1.",
        "Verb tertentu selalu diikuti infinitive.",
        "Jangan gunakan gerund setelah verb-verb ini.",
        "Kelompok verb ini sering muncul pada TOEFL, IELTS, TOEIC, dan ujian grammar.",
        "Cara terbaik menguasainya adalah menghafal daftar verb yang umum."
    ],

    patterns: [
        {
            group: "Desire",
            items: [
                {
                    label: "Want / Wish / Hope",
                    formula: "Verb + to + V1",
                    examples: [
                        "I want to sleep.",
                        "She hopes to win.",
                        "They wish to travel abroad."
                    ]
                }
            ]
        },

        {
            group: "Decision",
            items: [
                {
                    label: "Decide / Choose / Plan",
                    formula: "Verb + to + V1",
                    examples: [
                        "We decided to leave.",
                        "She chose to stay.",
                        "They plan to study overseas."
                    ]
                }
            ]
        },

        {
            group: "Agreement",
            items: [
                {
                    label: "Agree / Promise / Refuse",
                    formula: "Verb + to + V1",
                    examples: [
                        "He agreed to help.",
                        "She promised to come.",
                        "They refused to answer."
                    ]
                }
            ]
        },

        {
            group: "Learning",
            items: [
                {
                    label: "Learn / Manage / Fail",
                    formula: "Verb + to + V1",
                    examples: [
                        "She learned to drive.",
                        "He managed to escape.",
                        "They failed to finish."
                    ]
                }
            ]
        },

        {
            group: "Attempt",
            items: [
                {
                    label: "Try / Attempt / Offer",
                    formula: "Verb + to + V1",
                    examples: [
                        "I tried to call you.",
                        "She attempted to climb the mountain.",
                        "They offered to help."
                    ]
                }
            ]
        },

        {
            group: "Expectation",
            items: [
                {
                    label: "Expect / Seem / Pretend",
                    formula: "Verb + to + V1",
                    examples: [
                        "We expect to arrive early.",
                        "He seems to understand.",
                        "She pretended to sleep."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Desire",
            question: "I want ___ early.",
            options: ["leave", "leaving", "to leave", "left"],
            answer: "to leave",
            explanation: "Want selalu diikuti infinitive."
        },
        {
            type: "Desire",
            question: "She hopes ___ the competition.",
            options: ["win", "winning", "to win", "won"],
            answer: "to win",
            explanation: "Hope diikuti infinitive."
        },
        {
            type: "Decision",
            question: "We decided ___ home.",
            options: ["go", "going", "to go", "gone"],
            answer: "to go",
            explanation: "Decide selalu diikuti infinitive."
        },
        {
            type: "Decision",
            question: "They plan ___ abroad.",
            options: ["study", "studying", "to study", "studied"],
            answer: "to study",
            explanation: "Plan diikuti infinitive."
        },
        {
            type: "Agreement",
            question: "He promised ___ me.",
            options: ["help", "helping", "to help", "helped"],
            answer: "to help",
            explanation: "Promise diikuti infinitive."
        },
        {
            type: "Agreement",
            question: "She refused ___.",
            options: ["answer", "answering", "to answer", "answered"],
            answer: "to answer",
            explanation: "Refuse selalu diikuti infinitive."
        },
        {
            type: "Learning",
            question: "She learned ___ a car.",
            options: ["drive", "driving", "to drive", "drove"],
            answer: "to drive",
            explanation: "Learn diikuti infinitive."
        },
        {
            type: "Learning",
            question: "They managed ___ on time.",
            options: ["arrive", "arriving", "to arrive", "arrived"],
            answer: "to arrive",
            explanation: "Manage diikuti infinitive."
        },
        {
            type: "Attempt",
            question: "I tried ___ him yesterday.",
            options: ["call", "calling", "to call", "called"],
            answer: "to call",
            explanation: "Try (attempt) diikuti infinitive."
        },
        {
            type: "Attempt",
            question: "They offered ___ us.",
            options: ["help", "helping", "to help", "helped"],
            answer: "to help",
            explanation: "Offer diikuti infinitive."
        },
        {
            type: "Expectation",
            question: "We expect ___ tomorrow.",
            options: ["arrive", "arriving", "to arrive", "arrived"],
            answer: "to arrive",
            explanation: "Expect diikuti infinitive."
        },
        {
            type: "Expectation",
            question: "He seems ___ tired.",
            options: ["be", "being", "to be", "been"],
            answer: "to be",
            explanation: "Seem diikuti infinitive."
        },
        {
            type: "Concept",
            question: "Which verb is always followed by an infinitive?",
            options: ["Want", "Enjoy", "Avoid", "Keep"],
            answer: "Want",
            explanation: "Want termasuk kelompok verb + infinitive."
        },
        {
            type: "Concept",
            question: "Which sentence is correct?",
            options: [
                "I want sleeping.",
                "I want to sleep.",
                "I want sleep.",
                "I want slept."
            ],
            answer: "I want to sleep.",
            explanation: "Want + infinitive."
        },
        {
            type: "Concept",
            question: "Which sentence is correct?",
            options: [
                "She promised helping.",
                "She promised help.",
                "She promised to help.",
                "She promised helped."
            ],
            answer: "She promised to help.",
            explanation: "Promise diikuti infinitive."
        },
        {
            type: "Concept",
            question: "After 'decide', use...",
            options: ["Infinitive", "Gerund", "V2", "V3"],
            answer: "Infinitive",
            explanation: "Decide selalu diikuti infinitive."
        },
        {
            type: "Concept",
            question: "After 'plan', use...",
            options: ["Infinitive", "Gerund", "V2", "V3"],
            answer: "Infinitive",
            explanation: "Plan diikuti infinitive."
        },
        {
            type: "Concept",
            question: "After 'expect', use...",
            options: ["Infinitive", "Gerund", "V2", "V3"],
            answer: "Infinitive",
            explanation: "Expect diikuti infinitive."
        },
        {
            type: "Review",
            question: "Which sentence is grammatically correct?",
            options: [
                "They agreed to help.",
                "They agreed helping.",
                "They agreed help.",
                "They agreed helped."
            ],
            answer: "They agreed to help.",
            explanation: "Agree selalu diikuti infinitive."
        },
        {
            type: "Review",
            question: "Verb + Infinitive means...",
            options: [
                "Verb + to + V1",
                "Verb + V-ing",
                "Verb + V2",
                "Verb + V3"
            ],
            answer: "Verb + to + V1",
            explanation: "Kelompok verb ini selalu diikuti infinitive."
        }
    ]
},

"verb-both": {
    title: "Verb + Gerund / Infinitive",
    description: "Beberapa verb dapat diikuti gerund maupun infinitive. Namun, pada verb tertentu perubahan tersebut menyebabkan perubahan makna kalimat.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + Gerund ≠ Verb + Infinitive
    `,

    notes: [
        "Tidak semua verb yang bisa memakai gerund dan infinitive memiliki arti yang sama.",
        "Remember, forget, regret, stop, try, mean, go on merupakan verb yang paling sering diuji.",
        "Pelajari makna, bukan hanya rumus.",
        "Topik ini sangat sering muncul di TOEFL dan IELTS."
    ],

    patterns: [

        {
            group: "Remember",
            items: [
                {
                    label: "remember + gerund",
                    formula: "remember + V-ing = mengingat sesuatu yang sudah dilakukan",
                    examples: [
                        "I remember meeting her.",
                        "She remembers locking the door.",
                        "We remember visiting Bali."
                    ]
                },
                {
                    label: "remember + infinitive",
                    formula: "remember + to V1 = ingat untuk melakukan",
                    examples: [
                        "Remember to lock the door.",
                        "Remember to call your mother.",
                        "Please remember to study."
                    ]
                }
            ]
        },

        {
            group: "Forget",
            items: [
                {
                    label: "forget + gerund",
                    formula: "forget + V-ing = lupa pernah melakukan",
                    examples: [
                        "I forgot meeting him.",
                        "She forgot paying the bill.",
                        "He forgot seeing that movie."
                    ]
                },
                {
                    label: "forget + infinitive",
                    formula: "forget + to V1 = lupa melakukan",
                    examples: [
                        "I forgot to lock the door.",
                        "She forgot to call me.",
                        "He forgot to bring his book."
                    ]
                }
            ]
        },

        {
            group: "Stop",
            items: [
                {
                    label: "stop + gerund",
                    formula: "berhenti melakukan aktivitas",
                    examples: [
                        "He stopped smoking.",
                        "They stopped arguing.",
                        "She stopped talking."
                    ]
                },
                {
                    label: "stop + infinitive",
                    formula: "berhenti untuk melakukan sesuatu",
                    examples: [
                        "He stopped to smoke.",
                        "She stopped to buy coffee.",
                        "They stopped to rest."
                    ]
                }
            ]
        },

        {
            group: "Try",
            items: [
                {
                    label: "try + gerund",
                    formula: "mencoba sebagai eksperimen",
                    examples: [
                        "Try restarting your computer.",
                        "Try adding more salt.",
                        "Try exercising daily."
                    ]
                },
                {
                    label: "try + infinitive",
                    formula: "berusaha melakukan",
                    examples: [
                        "I tried to lift the box.",
                        "She tried to win.",
                        "They tried to escape."
                    ]
                }
            ]
        },

        {
            group: "Regret",
            items: [
                {
                    label: "regret + gerund",
                    formula: "menyesali sesuatu yang telah terjadi",
                    examples: [
                        "I regret saying that.",
                        "She regrets leaving early.",
                        "They regret selling the house."
                    ]
                },
                {
                    label: "regret + infinitive",
                    formula: "menyesal harus menyampaikan sesuatu",
                    examples: [
                        "We regret to inform you...",
                        "I regret to tell you...",
                        "She regrets to announce..."
                    ]
                }
            ]
        },

        {
            group: "Mean",
            items: [
                {
                    label: "mean + gerund",
                    formula: "berarti / mengakibatkan",
                    examples: [
                        "Being rich means working hard.",
                        "Winning means practicing.",
                        "Success means sacrificing."
                    ]
                },
                {
                    label: "mean + infinitive",
                    formula: "bermaksud",
                    examples: [
                        "I meant to call you.",
                        "She meant to help.",
                        "They meant to arrive early."
                    ]
                }
            ]
        },

        {
            group: "Go On",
            items: [
                {
                    label: "go on + gerund",
                    formula: "melanjutkan aktivitas yang sama",
                    examples: [
                        "He went on talking.",
                        "She went on reading.",
                        "They went on working."
                    ]
                },
                {
                    label: "go on + infinitive",
                    formula: "melanjutkan ke aktivitas berikutnya",
                    examples: [
                        "He went on to explain.",
                        "She went on to become a doctor.",
                        "They went on to win."
                    ]
                }
            ]
        }

    ],

    quiz: [

        {
            type:"Remember",
            question:"Remember ___ the lights before leaving.",
            options:["turning off","to turn off","turned","turn"],
            answer:"to turn off",
            explanation:"Remember to + V1 berarti ingat untuk melakukan."
        },

        {
            type:"Remember",
            question:"I remember ___ him years ago.",
            options:["meet","meeting","to meet","met"],
            answer:"meeting",
            explanation:"Remember + gerund berarti mengingat kejadian masa lalu."
        },

        {
            type:"Forget",
            question:"She forgot ___ me yesterday.",
            options:["call","calling","to call","called"],
            answer:"to call",
            explanation:"Forget to + V1 berarti lupa melakukan."
        },

        {
            type:"Stop",
            question:"He stopped ___ because it was unhealthy.",
            options:["smoke","smoking","to smoke","smoked"],
            answer:"smoking",
            explanation:"Stop + gerund berarti berhenti melakukan kebiasaan."
        },

        {
            type:"Stop",
            question:"We stopped ___ some coffee.",
            options:["buy","buying","to buy","bought"],
            answer:"to buy",
            explanation:"Stop to + V1 berarti berhenti untuk melakukan aktivitas lain."
        },

        {
            type:"Try",
            question:"Try ___ the computer again.",
            options:["restart","restarting","to restarting","restarted"],
            answer:"restarting",
            explanation:"Try + gerund berarti mencoba sebagai eksperimen."
        },

        {
            type:"Try",
            question:"She tried ___ the heavy box.",
            options:["lift","lifting","to lift","lifted"],
            answer:"to lift",
            explanation:"Try to + V1 berarti berusaha melakukan."
        },

        {
            type:"Regret",
            question:"We regret ___ that your application was unsuccessful.",
            options:["informing","to inform","informed","inform"],
            answer:"to inform",
            explanation:"Regret to + V1 umum dipakai pada pengumuman resmi."
        },

        {
            type:"Regret",
            question:"I regret ___ those words.",
            options:["say","saying","to say","said"],
            answer:"saying",
            explanation:"Regret + gerund berarti menyesali sesuatu yang telah dilakukan."
        },

        {
            type:"Mean",
            question:"Success means ___ hard.",
            options:["work","working","to work","worked"],
            answer:"working",
            explanation:"Mean + gerund berarti 'berarti'."
        },

        {
            type:"Mean",
            question:"I meant ___ you yesterday.",
            options:["call","calling","to call","called"],
            answer:"to call",
            explanation:"Mean to + V1 berarti bermaksud."
        },

        {
            type:"Go On",
            question:"She went on ___ after lunch.",
            options:["explain","explaining","to explain","explained"],
            answer:"to explain",
            explanation:"Go on to + V1 berarti lanjut ke aktivitas berikutnya."
        },

        {
            type:"Go On",
            question:"He went on ___ although nobody listened.",
            options:["talk","talking","to talk","talked"],
            answer:"talking",
            explanation:"Go on + gerund berarti melanjutkan aktivitas yang sama."
        },

        {
            type:"Concept",
            question:"Which verb changes meaning when followed by a gerund or an infinitive?",
            options:["Remember","Enjoy","Avoid","Finish"],
            answer:"Remember",
            explanation:"Remember adalah salah satu verb yang berubah makna tergantung pola yang digunakan."
        },

        {
            type:"Concept",
            question:"Which pair has different meanings?",
            options:[
                "remember meeting / remember to meet",
                "enjoy reading / enjoy reading",
                "avoid smoking / avoid smoking",
                "finish working / finish working"
            ],
            answer:"remember meeting / remember to meet",
            explanation:"Remember + gerund dan remember + infinitive memiliki makna yang berbeda."
        }

    ]
},

"gerund-review": {
    title: "Gerund & Infinitive Review",
    description: "Review ini menguji seluruh materi BAB 5, mulai dari Gerund, Infinitive, Verb + Gerund, Verb + Infinitive, hingga Verb yang dapat menggunakan keduanya dengan perubahan makna.",

    formula: `
        <strong>Ringkasan BAB 5</strong><br>
        Gerund = Verb + ing<br>
        Infinitive = to + Verb (V1)<br>
        Beberapa verb hanya memakai Gerund, sebagian hanya Infinitive, dan sebagian dapat memakai keduanya dengan makna berbeda.
    `,

    notes: [
        "Gerund = Verb + ing.",
        "Infinitive = to + V1.",
        "Enjoy, avoid, finish, suggest → Gerund.",
        "Want, decide, promise, hope → Infinitive.",
        "Remember, forget, stop, try, regret, mean → Makna berubah tergantung pola."
    ],

    patterns: [
        {
            group: "Ringkasan",
            items: [
                {
                    label: "Gerund",
                    formula: "Verb + ing",
                    examples: [
                        "I enjoy reading.",
                        "Swimming is fun.",
                        "She avoids driving."
                    ]
                },
                {
                    label: "Infinitive",
                    formula: "to + Verb",
                    examples: [
                        "I want to study.",
                        "She decided to leave.",
                        "They hope to win."
                    ]
                },
                {
                    label: "Meaning Changes",
                    formula: "Gerund ≠ Infinitive",
                    examples: [
                        "Remember meeting him.",
                        "Remember to meet him.",
                        "Stop smoking / Stop to smoke."
                    ]
                }
            ]
        }
    ],

    quiz: [

        {
            type:"Gerund",
            question:"I enjoy ___ books.",
            options:["read","reading","to read","reads"],
            answer:"reading",
            explanation:"Enjoy selalu diikuti gerund."
        },

        {
            type:"Gerund",
            question:"She avoids ___ late.",
            options:["arrive","arriving","to arrive","arrived"],
            answer:"arriving",
            explanation:"Avoid diikuti gerund."
        },

        {
            type:"Infinitive",
            question:"We decided ___ home.",
            options:["go","going","to go","gone"],
            answer:"to go",
            explanation:"Decide diikuti infinitive."
        },

        {
            type:"Infinitive",
            question:"He promised ___ us.",
            options:["help","helping","to help","helped"],
            answer:"to help",
            explanation:"Promise diikuti infinitive."
        },

        {
            type:"Infinitive",
            question:"She hopes ___ the exam.",
            options:["pass","passing","to pass","passed"],
            answer:"to pass",
            explanation:"Hope diikuti infinitive."
        },

        {
            type:"Comparison",
            question:"Which verb is followed by a gerund?",
            options:["Enjoy","Want","Hope","Promise"],
            answer:"Enjoy",
            explanation:"Enjoy termasuk Verb + Gerund."
        },

        {
            type:"Comparison",
            question:"Which verb is followed by an infinitive?",
            options:["Avoid","Finish","Want","Keep"],
            answer:"Want",
            explanation:"Want termasuk Verb + Infinitive."
        },

        {
            type:"Remember",
            question:"Remember ___ the lights before leaving.",
            options:["turning off","to turn off","turn","turned"],
            answer:"to turn off",
            explanation:"Remember to berarti ingat untuk melakukan."
        },

        {
            type:"Remember",
            question:"I remember ___ him before.",
            options:["meet","meeting","to meet","met"],
            answer:"meeting",
            explanation:"Remember + gerund berarti mengingat pengalaman."
        },

        {
            type:"Forget",
            question:"She forgot ___ me.",
            options:["call","calling","to call","called"],
            answer:"to call",
            explanation:"Forget to berarti lupa melakukan."
        },

        {
            type:"Stop",
            question:"He stopped ___ because it was unhealthy.",
            options:["smoke","smoking","to smoke","smoked"],
            answer:"smoking",
            explanation:"Stop + gerund berarti berhenti dari kebiasaan."
        },

        {
            type:"Stop",
            question:"We stopped ___ lunch.",
            options:["eat","eating","to eat","ate"],
            answer:"to eat",
            explanation:"Stop + infinitive berarti berhenti untuk melakukan sesuatu."
        },

        {
            type:"Try",
            question:"Try ___ your computer.",
            options:["restart","restarting","to restart","restarted"],
            answer:"restarting",
            explanation:"Try + gerund berarti mencoba sebagai eksperimen."
        },

        {
            type:"Try",
            question:"I tried ___ the heavy box.",
            options:["lift","lifting","to lift","lifted"],
            answer:"to lift",
            explanation:"Try + infinitive berarti berusaha."
        },

        {
            type:"Regret",
            question:"We regret ___ you that your application was unsuccessful.",
            options:["informing","to inform","inform","informed"],
            answer:"to inform",
            explanation:"Regret to + infinitive digunakan pada pengumuman formal."
        },

        {
            type:"Regret",
            question:"She regrets ___ school.",
            options:["leave","leaving","to leave","left"],
            answer:"leaving",
            explanation:"Regret + gerund berarti menyesali sesuatu."
        },

        {
            type:"Mean",
            question:"Success means ___ hard.",
            options:["work","working","to work","worked"],
            answer:"working",
            explanation:"Mean + gerund berarti 'berarti'."
        },

        {
            type:"Mean",
            question:"I meant ___ you yesterday.",
            options:["call","calling","to call","called"],
            answer:"to call",
            explanation:"Mean to berarti bermaksud."
        },

        {
            type:"Go On",
            question:"She went on ___ after the break.",
            options:["explain","explaining","to explain","explained"],
            answer:"to explain",
            explanation:"Go on to berarti lanjut ke aktivitas berikutnya."
        },

        {
            type:"Go On",
            question:"He went on ___ although nobody listened.",
            options:["talk","talking","to talk","talked"],
            answer:"talking",
            explanation:"Go on + gerund berarti melanjutkan aktivitas yang sama."
        },

        {
            type:"Concept",
            question:"Gerund is formed by...",
            options:["Verb + ing","to + Verb","Verb 2","Verb 3"],
            answer:"Verb + ing",
            explanation:"Gerund adalah Verb + ing."
        },

        {
            type:"Concept",
            question:"Infinitive is formed by...",
            options:["Verb + ing","to + Verb","Verb 2","Verb 3"],
            answer:"to + Verb",
            explanation:"Infinitive adalah to + V1."
        },

        {
            type:"Concept",
            question:"Which sentence is correct?",
            options:[
                "I enjoy to swim.",
                "I enjoy swimming.",
                "I enjoy swim.",
                "I enjoy swam."
            ],
            answer:"I enjoy swimming.",
            explanation:"Enjoy selalu diikuti gerund."
        },

        {
            type:"Concept",
            question:"Which sentence is correct?",
            options:[
                "She wants going home.",
                "She wants to go home.",
                "She wants go home.",
                "She wants gone home."
            ],
            answer:"She wants to go home.",
            explanation:"Want selalu diikuti infinitive."
        },

        {
            type:"Review",
            question:"After modal verbs we use...",
            options:["Verb 1","Gerund","Infinitive","Verb 3"],
            answer:"Verb 1",
            explanation:"Modal verb diikuti V1 tanpa 'to'."
        },

        {
            type:"Review",
            question:"Which pair changes meaning?",
            options:[
                "remember",
                "enjoy",
                "avoid",
                "finish"
            ],
            answer:"remember",
            explanation:"Remember + gerund dan remember + infinitive memiliki makna berbeda."
        },

        {
            type:"Review",
            question:"Which pair changes meaning?",
            options:[
                "stop",
                "practice",
                "mind",
                "avoid"
            ],
            answer:"stop",
            explanation:"Stop smoking ≠ Stop to smoke."
        },

        {
            type:"Review",
            question:"Which sentence is grammatically correct?",
            options:[
                "They avoided talking.",
                "They avoided to talk.",
                "They avoided talk.",
                "They avoided talked."
            ],
            answer:"They avoided talking.",
            explanation:"Avoid selalu diikuti gerund."
        },

        {
            type:"Review",
            question:"Which sentence is grammatically correct?",
            options:[
                "We decided leaving.",
                "We decided to leave.",
                "We decided leave.",
                "We decided left."
            ],
            answer:"We decided to leave.",
            explanation:"Decide selalu diikuti infinitive."
        },

        {
            type:"Final",
            question:"Which statement is TRUE?",
            options:[
                "All verbs can use gerund and infinitive interchangeably.",
                "Some verbs change meaning depending on gerund or infinitive.",
                "Gerund and infinitive are always interchangeable.",
                "Gerund is always incorrect after verbs."
            ],
            answer:"Some verbs change meaning depending on gerund or infinitive.",
            explanation:"Verb seperti remember, stop, regret, try, mean, dan go on berubah makna sesuai pola yang digunakan."
        }
    ]
},

"articles": {
    title: "Articles",
    description: "Articles adalah kata kecil yang diletakkan sebelum noun. Dalam Bahasa Inggris, articles utama adalah a, an, dan the. Articles membantu menjelaskan apakah noun bersifat umum, satu, atau sudah spesifik.",

    formula: `
        <strong>Inti Materi:</strong><br>
        a / an + singular countable noun<br>
        the + specific noun
    `,

    notes: [
        "A digunakan sebelum singular countable noun yang bunyinya konsonan.",
        "An digunakan sebelum singular countable noun yang bunyinya vokal.",
        "The digunakan untuk noun yang sudah spesifik atau sudah diketahui.",
        "A dan an tidak digunakan untuk plural noun.",
        "A dan an tidak digunakan untuk uncountable noun.",
        "Articles selalu berkaitan dengan noun."
    ],

    patterns: [
        {
            group: "A / An",
            items: [
                {
                    label: "A",
                    formula: "a + singular countable noun",
                    examples: [
                        "a book",
                        "a student",
                        "a university"
                    ]
                },
                {
                    label: "An",
                    formula: "an + vowel sound",
                    examples: [
                        "an apple",
                        "an egg",
                        "an hour"
                    ]
                }
            ]
        },
        {
            group: "The",
            items: [
                {
                    label: "Specific Noun",
                    formula: "the + specific noun",
                    examples: [
                        "The book on the table is mine.",
                        "I saw a cat. The cat was black.",
                        "The sun is bright."
                    ]
                }
            ]
        },
        {
            group: "No Article",
            items: [
                {
                    label: "General / Plural / Uncountable",
                    formula: "No article before general plural or uncountable noun",
                    examples: [
                        "Cats are cute.",
                        "Water is important.",
                        "Students need practice."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "A/An",
            question: "I have ___ book.",
            options: ["a", "an", "the", "no article"],
            answer: "a",
            explanation: "Book diawali bunyi konsonan, jadi gunakan a."
        },
        {
            type: "A/An",
            question: "She eats ___ apple.",
            options: ["a", "an", "the", "no article"],
            answer: "an",
            explanation: "Apple diawali bunyi vokal, jadi gunakan an."
        },
        {
            type: "A/An",
            question: "He is ___ honest man.",
            options: ["a", "an", "the", "no article"],
            answer: "an",
            explanation: "Honest diawali bunyi vokal karena h tidak dibaca."
        },
        {
            type: "A/An",
            question: "She studies at ___ university.",
            options: ["a", "an", "the", "no article"],
            answer: "a",
            explanation: "University diawali bunyi /yu/, yaitu bunyi konsonan, jadi gunakan a."
        },
        {
            type: "The",
            question: "I saw a dog. ___ dog was black.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "Dog sudah disebut sebelumnya, jadi menjadi spesifik."
        },
        {
            type: "The",
            question: "___ sun rises in the east.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "The sun unik dan spesifik."
        },
        {
            type: "No Article",
            question: "___ water is important.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Water sebagai uncountable noun umum tidak memakai article."
        },
        {
            type: "No Article",
            question: "___ cats are cute.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Plural noun umum tidak memakai article."
        },
        {
            type: "Concept",
            question: "A and an are used before...",
            options: [
                "singular countable nouns",
                "plural nouns only",
                "uncountable nouns only",
                "verbs"
            ],
            answer: "singular countable nouns",
            explanation: "A/an dipakai sebelum singular countable noun."
        },
        {
            type: "Concept",
            question: "The is used for...",
            options: [
                "specific nouns",
                "verbs",
                "adverbs only",
                "unknown general nouns only"
            ],
            answer: "specific nouns",
            explanation: "The digunakan untuk noun yang spesifik."
        }
    ]
},

"a-vs-an": {
    title: "A vs An",
    description: "A dan an digunakan sebelum singular countable noun. Pilihannya bukan berdasarkan huruf pertama, tetapi berdasarkan bunyi awal kata.",

    formula: `
        <strong>Inti Materi:</strong><br>
        a + consonant sound<br>
        an + vowel sound
    `,

    notes: [
        "Gunakan a sebelum bunyi konsonan.",
        "Gunakan an sebelum bunyi vokal.",
        "Yang menentukan adalah bunyi, bukan huruf.",
        "University memakai a karena berbunyi /yu/.",
        "Hour memakai an karena h tidak dibaca.",
        "A/an hanya untuk singular countable noun."
    ],

    patterns: [
        {
            group: "A",
            items: [
                {
                    label: "Consonant Sound",
                    formula: "a + consonant sound",
                    examples: [
                        "a book",
                        "a student",
                        "a car",
                        "a university",
                        "a European country"
                    ]
                }
            ]
        },
        {
            group: "An",
            items: [
                {
                    label: "Vowel Sound",
                    formula: "an + vowel sound",
                    examples: [
                        "an apple",
                        "an egg",
                        "an hour",
                        "an honest man",
                        "an umbrella"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "A",
            question: "I have ___ book.",
            options: ["a", "an", "the", "no article"],
            answer: "a",
            explanation: "Book diawali bunyi konsonan /b/, jadi gunakan a."
        },
        {
            type: "An",
            question: "She eats ___ orange.",
            options: ["a", "an", "the", "no article"],
            answer: "an",
            explanation: "Orange diawali bunyi vokal, jadi gunakan an."
        },
        {
            type: "A",
            question: "He studies at ___ university.",
            options: ["a", "an", "the", "no article"],
            answer: "a",
            explanation: "University berbunyi /yu/, jadi memakai a."
        },
        {
            type: "An",
            question: "It takes ___ hour.",
            options: ["a", "an", "the", "no article"],
            answer: "an",
            explanation: "Hour diawali bunyi vokal karena h tidak dibaca."
        },
        {
            type: "An",
            question: "He is ___ honest person.",
            options: ["a", "an", "the", "no article"],
            answer: "an",
            explanation: "Honest diawali bunyi vokal karena h tidak dibaca."
        },
        {
            type: "A",
            question: "She is ___ European student.",
            options: ["a", "an", "the", "no article"],
            answer: "a",
            explanation: "European berbunyi /yu/, jadi memakai a."
        },
        {
            type: "Concept",
            question: "A/an is chosen based on...",
            options: ["sound", "spelling only", "plural form", "verb tense"],
            answer: "sound",
            explanation: "A/an dipilih berdasarkan bunyi awal kata."
        },
        {
            type: "Concept",
            question: "A/an is used before...",
            options: [
                "singular countable noun",
                "plural noun",
                "uncountable noun only",
                "verb"
            ],
            answer: "singular countable noun",
            explanation: "A/an digunakan untuk singular countable noun."
        },
        {
            type: "Error Check",
            question: "Which phrase is correct?",
            options: ["a apple", "an apple", "a apples", "an books"],
            answer: "an apple",
            explanation: "Apple diawali bunyi vokal dan singular countable."
        },
        {
            type: "Error Check",
            question: "Which phrase is correct?",
            options: ["a hour", "an hour", "a honest man", "an university"],
            answer: "an hour",
            explanation: "Hour memakai an karena h tidak dibaca."
        }
    ]
},

"the-article": {
    title: "The",
    description: "The adalah definite article. The digunakan ketika noun sudah spesifik, sudah diketahui oleh pembicara dan pendengar, unik, atau sudah disebut sebelumnya.",

    formula: `
        <strong>Inti Materi:</strong><br>
        the + specific noun
    `,

    notes: [
        "The digunakan untuk noun yang spesifik.",
        "The digunakan jika noun sudah disebut sebelumnya.",
        "The digunakan untuk benda yang unik, seperti the sun dan the moon.",
        "The dapat digunakan sebelum singular, plural, dan uncountable noun.",
        "The tidak selalu berarti 'ini' atau 'itu', tetapi menunjukkan noun yang sudah jelas."
    ],

    patterns: [
        {
            group: "Specific Noun",
            items: [
                {
                    label: "Known Object",
                    formula: "the + noun yang sudah jelas",
                    examples: [
                        "The book on the table is mine.",
                        "The teacher in this class is kind.",
                        "The car outside is expensive."
                    ]
                }
            ]
        },
        {
            group: "Second Mention",
            items: [
                {
                    label: "A → The",
                    formula: "First mention: a/an, second mention: the",
                    examples: [
                        "I saw a cat. The cat was black.",
                        "She bought a book. The book was expensive.",
                        "He met a man. The man was friendly."
                    ]
                }
            ]
        },
        {
            group: "Unique Object",
            items: [
                {
                    label: "Only One",
                    formula: "the + unique noun",
                    examples: [
                        "The sun is bright.",
                        "The moon looks beautiful.",
                        "The sky is blue."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Specific",
            question: "___ book on the table is mine.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "Book sudah spesifik karena ada keterangan on the table."
        },
        {
            type: "Second Mention",
            question: "I saw a dog. ___ dog was black.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "Dog sudah disebut sebelumnya, jadi gunakan the."
        },
        {
            type: "Unique",
            question: "___ sun rises in the east.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "The sun unik dan spesifik."
        },
        {
            type: "Unique",
            question: "___ moon is beautiful tonight.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "The moon adalah benda unik."
        },
        {
            type: "Specific",
            question: "Please close ___ door.",
            options: ["a", "an", "the", "no article"],
            answer: "the",
            explanation: "Door yang dimaksud sudah jelas dalam konteks."
        },
        {
            type: "Second Mention",
            question: "She bought a dress. ___ dress was red.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "Dress sudah disebut sebelumnya."
        },
        {
            type: "Concept",
            question: "The is used for...",
            options: [
                "specific nouns",
                "unknown singular nouns only",
                "verbs",
                "adverbs"
            ],
            answer: "specific nouns",
            explanation: "The digunakan untuk noun yang spesifik atau sudah diketahui."
        },
        {
            type: "Concept",
            question: "The can be used before...",
            options: [
                "singular, plural, and uncountable nouns",
                "verbs only",
                "adjectives only",
                "adverbs only"
            ],
            answer: "singular, plural, and uncountable nouns",
            explanation: "The bisa dipakai sebelum singular, plural, dan uncountable noun."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "I saw a cat. A cat was black.",
                "I saw a cat. The cat was black.",
                "I saw an cat. The cat was black.",
                "I saw cat. A cat was black."
            ],
            answer: "I saw a cat. The cat was black.",
            explanation: "Penyebutan pertama memakai a, penyebutan kedua memakai the."
        },
        {
            type: "Meaning",
            question: "In 'the book on the table', the book is...",
            options: ["specific", "general", "plural", "verb"],
            answer: "specific",
            explanation: "Keterangan on the table membuat book menjadi spesifik."
        }
    ]
},

"zero-article": {
    title: "Zero Article",
    description: "Zero Article berarti tidak menggunakan article (a, an, atau the). Umumnya digunakan untuk plural noun dan uncountable noun yang bersifat umum, serta nama orang, negara, bahasa, mata pelajaran, dan sebagian besar nama tempat.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Ø + plural noun (general)<br>
        Ø + uncountable noun (general)<br>
        Ø + proper noun
    `,

    notes: [
        "Plural noun yang bersifat umum tidak memakai article.",
        "Uncountable noun yang bersifat umum tidak memakai article.",
        "Nama orang biasanya tidak memakai article.",
        "Nama negara umumnya tidak memakai article (Indonesia, Japan, France).",
        "Nama bahasa dan mata pelajaran tidak memakai article.",
        "Jika noun menjadi spesifik, gunakan the."
    ],

    patterns: [
        {
            group: "Plural Nouns",
            items: [
                {
                    label: "General Plural",
                    formula: "Ø + plural noun",
                    examples: [
                        "Cats are cute.",
                        "Students need practice.",
                        "Computers are useful."
                    ]
                }
            ]
        },
        {
            group: "Uncountable Nouns",
            items: [
                {
                    label: "General Uncountable",
                    formula: "Ø + uncountable noun",
                    examples: [
                        "Water is important.",
                        "Milk is healthy.",
                        "Information is valuable."
                    ]
                }
            ]
        },
        {
            group: "Proper Nouns",
            items: [
                {
                    label: "Names",
                    formula: "Ø + proper noun",
                    examples: [
                        "Rina is my friend.",
                        "Indonesia is beautiful.",
                        "English is easy."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Plural",
            question: "___ dogs are loyal animals.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Plural noun yang bersifat umum tidak memakai article."
        },
        {
            type: "Plural",
            question: "___ students should study hard.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Students digunakan secara umum."
        },
        {
            type: "Uncountable",
            question: "___ water is essential for life.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Water sebagai uncountable noun umum tidak memakai article."
        },
        {
            type: "Uncountable",
            question: "___ information is useful.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Information adalah uncountable noun."
        },
        {
            type: "Proper Noun",
            question: "___ Indonesia is a beautiful country.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Nama negara umumnya tidak memakai article."
        },
        {
            type: "Proper Noun",
            question: "She speaks ___ English well.",
            options: ["a", "an", "the", "no article"],
            answer: "no article",
            explanation: "Nama bahasa tidak memakai article."
        },
        {
            type: "Concept",
            question: "Zero article is commonly used before...",
            options: [
                "general plural nouns",
                "singular countable nouns",
                "verbs",
                "adjectives"
            ],
            answer: "general plural nouns",
            explanation: "Plural noun yang bersifat umum memakai zero article."
        },
        {
            type: "Concept",
            question: "Which noun usually uses zero article?",
            options: [
                "Indonesia",
                "the book on the table",
                "an apple",
                "the sun"
            ],
            answer: "Indonesia",
            explanation: "Nama negara umumnya tidak memakai article."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The cats are friendly. (all cats in general)",
                "Cats are friendly.",
                "A cats are friendly.",
                "An cats are friendly."
            ],
            answer: "Cats are friendly.",
            explanation: "Plural noun umum menggunakan zero article."
        },
        {
            type: "Comparison",
            question: "Which sentence refers to something specific?",
            options: [
                "Books are expensive.",
                "The books on the desk are mine.",
                "Water is important.",
                "English is easy."
            ],
            answer: "The books on the desk are mine.",
            explanation: "Keterangan 'on the desk' membuat noun menjadi spesifik sehingga menggunakan 'the'."
        }
    ]
},

"determiners": {
    title: "Determiners",
    description: "Determiners adalah kata yang diletakkan sebelum noun untuk memberikan informasi tentang jumlah, kepemilikan, jarak, atau identitas noun tersebut. Articles (a, an, the) juga termasuk determiner.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Determiner + Noun
    `,

    notes: [
        "Determiner selalu berada sebelum noun.",
        "Article (a, an, the) termasuk determiner.",
        "Possessive determiner menunjukkan kepemilikan.",
        "Demonstrative determiner menunjukkan jarak.",
        "Distributive determiner menunjukkan anggota dalam kelompok.",
        "Biasanya hanya satu determiner utama digunakan sebelum noun."
    ],

    patterns: [
        {
            group: "Articles",
            items: [
                {
                    label: "Articles",
                    formula: "a / an / the + noun",
                    examples: [
                        "a book",
                        "an apple",
                        "the car"
                    ]
                }
            ]
        },
        {
            group: "Possessive Determiners",
            items: [
                {
                    label: "Possessive",
                    formula: "my, your, his, her, our, their + noun",
                    examples: [
                        "my house",
                        "your car",
                        "their school"
                    ]
                }
            ]
        },
        {
            group: "Demonstratives",
            items: [
                {
                    label: "This / That / These / Those",
                    formula: "demonstrative + noun",
                    examples: [
                        "this book",
                        "that car",
                        "these students",
                        "those houses"
                    ]
                }
            ]
        },
        {
            group: "Distributives",
            items: [
                {
                    label: "Each / Every / Either / Neither",
                    formula: "distributive + noun",
                    examples: [
                        "Each student passed.",
                        "Every child smiled.",
                        "Either answer is correct.",
                        "Neither option works."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Possessive",
            question: "___ book is on the table.",
            options: ["My", "Mine", "Me", "I"],
            answer: "My",
            explanation: "Possessive determiner digunakan sebelum noun."
        },
        {
            type: "Demonstrative",
            question: "___ apples are fresh.",
            options: ["This", "That", "These", "It"],
            answer: "These",
            explanation: "These digunakan untuk benda jamak yang dekat."
        },
        {
            type: "Demonstrative",
            question: "___ car over there is expensive.",
            options: ["This", "These", "That", "Those"],
            answer: "That",
            explanation: "That digunakan untuk benda tunggal yang jauh."
        },
        {
            type: "Distributive",
            question: "___ student received a certificate.",
            options: ["Every", "Many", "Several", "Few"],
            answer: "Every",
            explanation: "Every digunakan untuk setiap anggota kelompok."
        },
        {
            type: "Distributive",
            question: "___ of the answers is correct.",
            options: ["Either", "Many", "Several", "Both"],
            answer: "Either",
            explanation: "Either berarti salah satu dari dua."
        },
        {
            type: "Concept",
            question: "Determiners usually come...",
            options: [
                "before a noun",
                "after a noun",
                "after a verb",
                "before a verb"
            ],
            answer: "before a noun",
            explanation: "Determiner selalu berada sebelum noun."
        },
        {
            type: "Concept",
            question: "Which word is a determiner?",
            options: [
                "my",
                "run",
                "quickly",
                "beautiful"
            ],
            answer: "my",
            explanation: "My adalah possessive determiner."
        },
        {
            type: "Concept",
            question: "Which is NOT a determiner?",
            options: [
                "this",
                "their",
                "quickly",
                "every"
            ],
            answer: "quickly",
            explanation: "Quickly adalah adverb."
        },
        {
            type: "Usage",
            question: "Choose the correct phrase.",
            options: [
                "these books",
                "this books",
                "those book",
                "these book"
            ],
            answer: "these books",
            explanation: "These digunakan untuk plural noun."
        },
        {
            type: "Usage",
            question: "Choose the correct sentence.",
            options: [
                "Every students passed.",
                "Every student passed.",
                "Every student pass.",
                "Every students pass."
            ],
            answer: "Every student passed.",
            explanation: "Every selalu diikuti singular noun."
        }
    ]
},

"quantifiers": {
    title: "Quantifiers",
    description: "Quantifiers adalah kata yang menunjukkan jumlah atau kuantitas suatu noun. Penggunaannya bergantung pada apakah noun tersebut countable atau uncountable.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Quantifier + Noun
    `,

    notes: [
        "Many digunakan untuk countable noun.",
        "Much digunakan untuk uncountable noun.",
        "Few berarti sedikit (countable).",
        "Little berarti sedikit (uncountable).",
        "A few berarti beberapa (masih bernilai positif).",
        "A little berarti sedikit tetapi cukup.",
        "Some digunakan pada kalimat positif.",
        "Any umumnya digunakan pada kalimat negatif dan pertanyaan.",
        "A lot of dapat digunakan untuk countable maupun uncountable noun."
    ],

    patterns: [
        {
            group: "Countable",
            items: [
                {
                    label: "Many / Few / A Few",
                    formula: "Quantifier + Countable Noun",
                    examples: [
                        "Many students attended.",
                        "Few people agreed.",
                        "A few books are missing."
                    ]
                }
            ]
        },
        {
            group: "Uncountable",
            items: [
                {
                    label: "Much / Little / A Little",
                    formula: "Quantifier + Uncountable Noun",
                    examples: [
                        "Much money was spent.",
                        "Little water remained.",
                        "A little sugar is enough."
                    ]
                }
            ]
        },
        {
            group: "Both Types",
            items: [
                {
                    label: "Some / Any / A lot of",
                    formula: "Quantifier + Noun",
                    examples: [
                        "Some students are here.",
                        "Do you have any questions?",
                        "A lot of people came."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Countable",
            question: "How ___ books do you have?",
            options: ["many", "much", "little", "a little"],
            answer: "many",
            explanation: "Books adalah countable noun."
        },
        {
            type: "Uncountable",
            question: "How ___ water do you drink?",
            options: ["many", "few", "much", "a few"],
            answer: "much",
            explanation: "Water adalah uncountable noun."
        },
        {
            type: "Few",
            question: "There are only ___ students in the class.",
            options: ["few", "little", "much", "many"],
            answer: "few",
            explanation: "Students adalah countable noun."
        },
        {
            type: "Little",
            question: "There is very ___ milk left.",
            options: ["few", "little", "many", "a few"],
            answer: "little",
            explanation: "Milk adalah uncountable noun."
        },
        {
            type: "Positive",
            question: "I have ___ friends in London.",
            options: ["a few", "little", "much", "any"],
            answer: "a few",
            explanation: "A few berarti beberapa dan digunakan untuk countable noun."
        },
        {
            type: "Positive",
            question: "Add ___ salt.",
            options: ["a little", "few", "many", "a few"],
            answer: "a little",
            explanation: "Salt adalah uncountable noun."
        },
        {
            type: "Some/Any",
            question: "Do you have ___ questions?",
            options: ["some", "any", "many", "few"],
            answer: "any",
            explanation: "Any umum digunakan pada pertanyaan."
        },
        {
            type: "Some/Any",
            question: "She bought ___ apples.",
            options: ["any", "some", "few", "little"],
            answer: "some",
            explanation: "Some umum digunakan pada kalimat positif."
        },
        {
            type: "A lot of",
            question: "___ people joined the event.",
            options: ["A lot of", "Much", "Little", "Few"],
            answer: "A lot of",
            explanation: "A lot of dapat digunakan untuk countable noun."
        },
        {
            type: "Concept",
            question: "Which quantifier can be used for both countable and uncountable nouns?",
            options: [
                "A lot of",
                "Many",
                "Much",
                "Few"
            ],
            answer: "A lot of",
            explanation: "A lot of dapat digunakan pada kedua jenis noun."
        }
    ]
},

"articles-review": {
    title: "Articles & Determiners Review",
    description: "Review ini menguji seluruh materi BAB 6: articles, a vs an, the, zero article, determiners, dan quantifiers.",

    formula: `
        <strong>Ringkasan BAB 6:</strong><br>
        a/an = singular countable noun<br>
        the = specific noun<br>
        zero article = general plural / uncountable / proper noun<br>
        determiner = kata sebelum noun<br>
        quantifier = jumlah noun
    `,

    notes: [
        "A digunakan sebelum bunyi konsonan.",
        "An digunakan sebelum bunyi vokal.",
        "The digunakan untuk noun yang spesifik.",
        "Zero article digunakan untuk plural noun umum dan uncountable noun umum.",
        "Determiners meliputi article, possessive, demonstrative, dan distributive.",
        "Many untuk countable noun.",
        "Much untuk uncountable noun.",
        "A lot of bisa digunakan untuk countable dan uncountable noun."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Articles",
                    formula: "a / an / the / zero article",
                    examples: [
                        "a book",
                        "an apple",
                        "the book on the table",
                        "Water is important."
                    ]
                },
                {
                    label: "Determiners",
                    formula: "determiner + noun",
                    examples: [
                        "my book",
                        "this car",
                        "every student"
                    ]
                },
                {
                    label: "Quantifiers",
                    formula: "quantifier + noun",
                    examples: [
                        "many books",
                        "much water",
                        "a lot of people"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "A/An",
            question: "She has ___ apple.",
            options: ["a", "an", "the", "no article"],
            answer: "an",
            explanation: "Apple diawali bunyi vokal."
        },
        {
            type: "A/An",
            question: "He is ___ honest man.",
            options: ["a", "an", "the", "no article"],
            answer: "an",
            explanation: "Honest diawali bunyi vokal karena h tidak dibaca."
        },
        {
            type: "A/An",
            question: "She studies at ___ university.",
            options: ["a", "an", "the", "no article"],
            answer: "a",
            explanation: "University berbunyi /yu/, jadi memakai a."
        },
        {
            type: "The",
            question: "I saw a bird. ___ bird was beautiful.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "Bird sudah disebut sebelumnya."
        },
        {
            type: "The",
            question: "___ sun is bright today.",
            options: ["A", "An", "The", "No article"],
            answer: "The",
            explanation: "Sun adalah benda unik."
        },
        {
            type: "Zero Article",
            question: "___ water is important.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Water sebagai uncountable noun umum tidak memakai article."
        },
        {
            type: "Zero Article",
            question: "___ cats are friendly.",
            options: ["A", "An", "The", "No article"],
            answer: "No article",
            explanation: "Plural noun umum memakai zero article."
        },
        {
            type: "Zero Article",
            question: "She speaks ___ English.",
            options: ["a", "an", "the", "no article"],
            answer: "no article",
            explanation: "Nama bahasa tidak memakai article."
        },
        {
            type: "Determiner",
            question: "___ book is on the table.",
            options: ["My", "Mine", "Me", "I"],
            answer: "My",
            explanation: "My adalah possessive determiner sebelum noun."
        },
        {
            type: "Determiner",
            question: "___ students are waiting outside.",
            options: ["This", "That", "These", "It"],
            answer: "These",
            explanation: "These digunakan untuk plural noun yang dekat."
        },
        {
            type: "Determiner",
            question: "___ student must submit the task.",
            options: ["Every", "Many", "Few", "Several"],
            answer: "Every",
            explanation: "Every diikuti singular noun."
        },
        {
            type: "Quantifier",
            question: "How ___ books do you have?",
            options: ["many", "much", "little", "a little"],
            answer: "many",
            explanation: "Books adalah countable noun."
        },
        {
            type: "Quantifier",
            question: "How ___ water do you drink?",
            options: ["many", "much", "few", "a few"],
            answer: "much",
            explanation: "Water adalah uncountable noun."
        },
        {
            type: "Quantifier",
            question: "There are ___ students in the class.",
            options: ["many", "much", "little", "a little"],
            answer: "many",
            explanation: "Students adalah countable noun."
        },
        {
            type: "Quantifier",
            question: "There is ___ milk left.",
            options: ["few", "little", "many", "a few"],
            answer: "little",
            explanation: "Milk adalah uncountable noun."
        },
        {
            type: "Quantifier",
            question: "She bought ___ apples.",
            options: ["some", "much", "little", "a little"],
            answer: "some",
            explanation: "Some dapat digunakan untuk plural countable noun."
        },
        {
            type: "Quantifier",
            question: "Do you have ___ questions?",
            options: ["some", "any", "much", "little"],
            answer: "any",
            explanation: "Any umum dipakai pada pertanyaan."
        },
        {
            type: "Quantifier",
            question: "___ people joined the meeting.",
            options: ["A lot of", "Much", "Little", "A little"],
            answer: "A lot of",
            explanation: "A lot of bisa digunakan untuk countable noun."
        },
        {
            type: "Error Check",
            question: "Which phrase is correct?",
            options: ["a apple", "an apple", "a apples", "an books"],
            answer: "an apple",
            explanation: "Apple diawali bunyi vokal dan singular countable."
        },
        {
            type: "Error Check",
            question: "Which phrase is correct?",
            options: ["this books", "these books", "those book", "these book"],
            answer: "these books",
            explanation: "These digunakan untuk plural noun."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Every students passed.",
                "Every student passed.",
                "Every student pass.",
                "Every students pass."
            ],
            answer: "Every student passed.",
            explanation: "Every diikuti singular noun."
        },
        {
            type: "Concept",
            question: "A and an are used before...",
            options: [
                "singular countable nouns",
                "plural nouns only",
                "uncountable nouns only",
                "verbs"
            ],
            answer: "singular countable nouns",
            explanation: "A/an digunakan sebelum singular countable noun."
        },
        {
            type: "Concept",
            question: "The is used for...",
            options: ["specific nouns", "unknown verbs", "adverbs", "general plural nouns only"],
            answer: "specific nouns",
            explanation: "The digunakan untuk noun yang spesifik."
        },
        {
            type: "Concept",
            question: "Zero article is commonly used for...",
            options: [
                "general plural nouns",
                "specific singular nouns only",
                "verbs",
                "modal verbs"
            ],
            answer: "general plural nouns",
            explanation: "Plural noun umum biasanya tidak memakai article."
        },
        {
            type: "Concept",
            question: "Which word is a determiner?",
            options: ["their", "quickly", "run", "beautiful"],
            answer: "their",
            explanation: "Their adalah possessive determiner."
        },
        {
            type: "Concept",
            question: "Which word is a quantifier?",
            options: ["many", "beautiful", "quickly", "under"],
            answer: "many",
            explanation: "Many menunjukkan jumlah."
        },
        {
            type: "Comparison",
            question: "Which sentence is specific?",
            options: [
                "Books are useful.",
                "The books on the shelf are useful.",
                "Water is important.",
                "Cats are cute."
            ],
            answer: "The books on the shelf are useful.",
            explanation: "On the shelf membuat books menjadi spesifik."
        },
        {
            type: "Comparison",
            question: "Which noun is uncountable?",
            options: ["water", "book", "student", "apple"],
            answer: "water",
            explanation: "Water adalah uncountable noun."
        },
        {
            type: "Comparison",
            question: "Which noun is countable?",
            options: ["information", "milk", "rice", "chair"],
            answer: "chair",
            explanation: "Chair bisa dihitung."
        },
        {
            type: "Final",
            question: "Which sentence is correct?",
            options: [
                "I need an information.",
                "I need a information.",
                "I need information.",
                "I need informations."
            ],
            answer: "I need information.",
            explanation: "Information adalah uncountable noun, jadi tidak memakai a/an dan tidak dibuat plural."
        }
    ]
},

"conditionals": {
    title: "Introduction to Conditionals",
    description: "Conditional Sentence adalah kalimat pengandaian yang menunjukkan hubungan antara syarat dan hasil. Kalimat ini biasanya memakai if untuk menjelaskan apa yang terjadi jika suatu kondisi terpenuhi.",

    formula: `
        <strong>Inti Materi:</strong><br>
        If + Condition, Result<br>
        Result + if + Condition
    `,

    notes: [
        "Conditional sentence terdiri dari condition dan result.",
        "Condition adalah syarat.",
        "Result adalah hasil dari syarat tersebut.",
        "If biasanya digunakan untuk memperkenalkan syarat.",
        "Jika if-clause berada di awal kalimat, biasanya gunakan koma.",
        "Conditional sentence memiliki beberapa jenis: Zero, First, Second, Third, dan Mixed Conditional."
    ],

    patterns: [
        {
            group: "Basic Structure",
            items: [
                {
                    label: "If Clause First",
                    formula: "If + condition, result",
                    examples: [
                        "If it rains, I stay at home.",
                        "If you study, you understand better.",
                        "If she calls, I answer."
                    ]
                },
                {
                    label: "Result First",
                    formula: "Result + if + condition",
                    examples: [
                        "I stay at home if it rains.",
                        "You understand better if you study.",
                        "I answer if she calls."
                    ]
                }
            ]
        },
        {
            group: "Types",
            items: [
                {
                    label: "Real Conditions",
                    formula: "Real / possible situations",
                    examples: [
                        "If water reaches 100°C, it boils.",
                        "If I have time, I will call you."
                    ]
                },
                {
                    label: "Unreal Conditions",
                    formula: "Imaginary / impossible / past unreal situations",
                    examples: [
                        "If I had more money, I would travel.",
                        "If she had studied, she would have passed."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Conditional sentence usually shows...",
            options: ["condition and result", "noun and adjective", "subject only", "article only"],
            answer: "condition and result",
            explanation: "Conditional sentence menunjukkan hubungan antara syarat dan hasil."
        },
        {
            type: "Concept",
            question: "Which word is commonly used in conditional sentences?",
            options: ["if", "wow", "the", "quickly"],
            answer: "if",
            explanation: "If digunakan untuk memperkenalkan condition."
        },
        {
            type: "Structure",
            question: "In 'If it rains, I stay home', 'If it rains' is...",
            options: ["condition", "result", "object", "article"],
            answer: "condition",
            explanation: "If it rains adalah syarat atau condition."
        },
        {
            type: "Structure",
            question: "In 'If it rains, I stay home', 'I stay home' is...",
            options: ["condition", "result", "preposition", "determiner"],
            answer: "result",
            explanation: "I stay home adalah hasil dari condition."
        },
        {
            type: "Comma",
            question: "Which sentence uses comma correctly?",
            options: [
                "If it rains, I stay home.",
                "If it rains I, stay home.",
                "I stay, home if it rains.",
                "If, it rains I stay home."
            ],
            answer: "If it rains, I stay home.",
            explanation: "Jika if-clause berada di awal, gunakan koma setelah clause tersebut."
        },
        {
            type: "Order",
            question: "Which sentence is also correct?",
            options: [
                "I stay home if it rains.",
                "I if it rains stay home.",
                "If stay home it rains.",
                "It rains if stay home."
            ],
            answer: "I stay home if it rains.",
            explanation: "Result bisa muncul di awal tanpa koma sebelum if-clause."
        },
        {
            type: "Type",
            question: "Which conditional is used for general facts?",
            options: ["Zero Conditional", "Third Conditional", "Mixed Conditional", "Reported Speech"],
            answer: "Zero Conditional",
            explanation: "Zero Conditional digunakan untuk fakta umum atau kebiasaan."
        },
        {
            type: "Type",
            question: "Which conditional is used for possible future situations?",
            options: ["First Conditional", "Zero Conditional only", "Third Conditional", "Passive Voice"],
            answer: "First Conditional",
            explanation: "First Conditional digunakan untuk kemungkinan nyata di masa depan."
        },
        {
            type: "Type",
            question: "Which conditional is used for unreal present situations?",
            options: ["Second Conditional", "Zero Conditional", "Simple Present", "Article"],
            answer: "Second Conditional",
            explanation: "Second Conditional digunakan untuk situasi imajinatif atau tidak nyata sekarang."
        },
        {
            type: "Type",
            question: "Which conditional is used for unreal past situations?",
            options: ["Third Conditional", "First Conditional", "Zero Conditional", "Determiner"],
            answer: "Third Conditional",
            explanation: "Third Conditional digunakan untuk pengandaian masa lampau yang tidak terjadi."
        }
    ]
},

"zero-conditional": {
    title: "Zero Conditional",
    description: "Zero Conditional digunakan untuk fakta umum, kebenaran ilmiah, aturan, atau kebiasaan yang selalu benar jika syaratnya terpenuhi.",

    formula: `
        <strong>Inti Materi:</strong><br>
        If + Simple Present, Simple Present
    `,

    notes: [
        "Zero Conditional digunakan untuk fakta umum.",
        "Kedua clause memakai Simple Present.",
        "If dapat diganti dengan when jika maknanya selalu terjadi.",
        "Jika if-clause berada di awal, gunakan koma.",
        "Zero Conditional tidak memakai will."
    ],

    patterns: [
        {
            group: "Basic Form",
            items: [
                {
                    label: "If First",
                    formula: "If + Simple Present, Simple Present",
                    examples: [
                        "If water reaches 100°C, it boils.",
                        "If you heat ice, it melts.",
                        "If people eat too much, they gain weight."
                    ]
                },
                {
                    label: "Result First",
                    formula: "Simple Present + if + Simple Present",
                    examples: [
                        "Water boils if it reaches 100°C.",
                        "Ice melts if you heat it.",
                        "People gain weight if they eat too much."
                    ]
                }
            ]
        },
        {
            group: "When",
            items: [
                {
                    label: "If / When",
                    formula: "When + Simple Present, Simple Present",
                    examples: [
                        "When it rains, the ground gets wet.",
                        "When the sun sets, it gets dark.",
                        "When students practice, they improve."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Formula",
            question: "Zero Conditional uses...",
            options: [
                "If + Simple Present, Simple Present",
                "If + Simple Present, will + V1",
                "If + Simple Past, would + V1",
                "If + Past Perfect, would have + V3"
            ],
            answer: "If + Simple Present, Simple Present",
            explanation: "Zero Conditional memakai Simple Present di kedua clause."
        },
        {
            type: "Fact",
            question: "If water reaches 100°C, it ___.",
            options: ["boil", "boils", "will boil", "boiled"],
            answer: "boils",
            explanation: "Zero Conditional memakai Simple Present."
        },
        {
            type: "Fact",
            question: "If you heat ice, it ___.",
            options: ["melts", "will melt", "melted", "would melt"],
            answer: "melts",
            explanation: "Ini fakta umum, jadi gunakan Simple Present."
        },
        {
            type: "Fact",
            question: "If people eat too much, they ___ weight.",
            options: ["gain", "gains", "will gain", "gained"],
            answer: "gain",
            explanation: "Subject they memakai V1 biasa."
        },
        {
            type: "When",
            question: "___ it rains, the ground gets wet.",
            options: ["When", "Would", "Had", "Will"],
            answer: "When",
            explanation: "When bisa digunakan untuk kejadian yang selalu benar."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If water reaches 100°C, it will boil.",
                "If water reaches 100°C, it boils.",
                "If water reached 100°C, it boils.",
                "If water has reached 100°C, it would boil."
            ],
            answer: "If water reaches 100°C, it boils.",
            explanation: "Zero Conditional tidak memakai will pada result clause."
        },
        {
            type: "Concept",
            question: "Zero Conditional is used for...",
            options: [
                "general facts",
                "unreal past situations",
                "imaginary present situations",
                "reported speech"
            ],
            answer: "general facts",
            explanation: "Zero Conditional digunakan untuk fakta umum atau aturan yang selalu benar."
        },
        {
            type: "Comma",
            question: "Which punctuation is correct?",
            options: [
                "If you heat ice, it melts.",
                "If you heat, ice it melts.",
                "If, you heat ice it melts.",
                "If you heat ice it, melts."
            ],
            answer: "If you heat ice, it melts.",
            explanation: "Jika if-clause di awal, gunakan koma setelah clause."
        },
        {
            type: "Order",
            question: "Which sentence is correct?",
            options: [
                "Ice melts if you heat it.",
                "Ice if you heat it melts.",
                "If ice melts you heat it.",
                "Melts ice if you heat it."
            ],
            answer: "Ice melts if you heat it.",
            explanation: "Result clause bisa diletakkan sebelum if-clause."
        },
        {
            type: "Concept",
            question: "In Zero Conditional, 'if' can often be replaced by...",
            options: ["when", "would", "must", "although"],
            answer: "when",
            explanation: "Untuk kejadian yang selalu benar, if sering bisa diganti dengan when."
        }
    ]
},

"first-conditional": {
    title: "First Conditional",
    description: "First Conditional digunakan untuk kemungkinan nyata di masa depan. Kalimat ini menunjukkan bahwa suatu hasil kemungkinan akan terjadi jika syaratnya terpenuhi.",

    formula: `
        <strong>Inti Materi:</strong><br>
        If + Simple Present, Subject + will + V1
    `,

    notes: [
        "First Conditional digunakan untuk situasi masa depan yang mungkin terjadi.",
        "If-clause memakai Simple Present.",
        "Result clause memakai will + V1.",
        "Jangan gunakan will di dalam if-clause.",
        "Jika if-clause berada di awal, gunakan koma."
    ],

    patterns: [
        {
            group: "Basic Form",
            items: [
                {
                    label: "If First",
                    formula: "If + Simple Present, will + V1",
                    examples: [
                        "If it rains, I will stay at home.",
                        "If you study, you will pass the exam.",
                        "If she calls, I will answer."
                    ]
                },
                {
                    label: "Result First",
                    formula: "Will + V1 + if + Simple Present",
                    examples: [
                        "I will stay at home if it rains.",
                        "You will pass the exam if you study.",
                        "I will answer if she calls."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Formula",
            question: "First Conditional uses...",
            options: [
                "If + Simple Present, will + V1",
                "If + Simple Past, would + V1",
                "If + Past Perfect, would have + V3",
                "If + Simple Present, Simple Present"
            ],
            answer: "If + Simple Present, will + V1",
            explanation: "First Conditional memakai If + Simple Present, will + V1."
        },
        {
            type: "Future Possibility",
            question: "If it rains, I ___ stay at home.",
            options: ["will", "would", "was", "had"],
            answer: "will",
            explanation: "Result clause First Conditional memakai will + V1."
        },
        {
            type: "Future Possibility",
            question: "If you study hard, you ___ pass the exam.",
            options: ["will", "would", "had", "were"],
            answer: "will",
            explanation: "First Conditional menunjukkan kemungkinan nyata di masa depan."
        },
        {
            type: "If Clause",
            question: "If she ___ me, I will answer.",
            options: ["call", "calls", "called", "will call"],
            answer: "calls",
            explanation: "If-clause memakai Simple Present. Subject she memakai calls."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If it will rain, I will stay home.",
                "If it rains, I will stay home.",
                "If it rained, I will stay home.",
                "If it rains, I would stay home."
            ],
            answer: "If it rains, I will stay home.",
            explanation: "Jangan gunakan will di dalam if-clause."
        },
        {
            type: "Comma",
            question: "Which sentence uses comma correctly?",
            options: [
                "If you study, you will pass.",
                "If, you study you will pass.",
                "If you, study you will pass.",
                "If you study you, will pass."
            ],
            answer: "If you study, you will pass.",
            explanation: "Jika if-clause di awal, gunakan koma."
        },
        {
            type: "Order",
            question: "Which sentence is also correct?",
            options: [
                "You will pass if you study.",
                "You pass will if you study.",
                "If you will study, you pass.",
                "You would pass if you study."
            ],
            answer: "You will pass if you study.",
            explanation: "Result clause bisa diletakkan sebelum if-clause."
        },
        {
            type: "Concept",
            question: "First Conditional is used for...",
            options: [
                "real future possibilities",
                "general facts only",
                "unreal past situations",
                "past habits"
            ],
            answer: "real future possibilities",
            explanation: "First Conditional digunakan untuk kemungkinan nyata di masa depan."
        },
        {
            type: "Result",
            question: "If they arrive early, we ___ start the meeting.",
            options: ["will", "would", "had", "were"],
            answer: "will",
            explanation: "Result clause memakai will + V1."
        },
        {
            type: "If Clause",
            question: "If he ___ late, we will leave without him.",
            options: ["is", "will be", "was", "were"],
            answer: "is",
            explanation: "If-clause First Conditional memakai Simple Present."
        }
    ]
},

"second-conditional": {
    title: "Second Conditional",
    description: "Second Conditional digunakan untuk situasi imajinatif, tidak nyata, atau kecil kemungkinan terjadi di masa sekarang atau masa depan.",

    formula: `
        <strong>Inti Materi:</strong><br>
        If + Simple Past, Subject + would + V1
    `,

    notes: [
        "Second Conditional digunakan untuk kondisi tidak nyata atau imajinatif.",
        "If-clause memakai Simple Past.",
        "Result clause memakai would + V1.",
        "Untuk semua subject, bentuk formal menggunakan were pada be verb.",
        "Second Conditional sering digunakan untuk impian, saran, dan situasi hipotetis."
    ],

    patterns: [
        {
            group: "Basic Form",
            items: [
                {
                    label: "If First",
                    formula: "If + Simple Past, would + V1",
                    examples: [
                        "If I had more money, I would travel.",
                        "If she studied harder, she would pass.",
                        "If they lived here, we would meet often."
                    ]
                },
                {
                    label: "Result First",
                    formula: "Would + V1 + if + Simple Past",
                    examples: [
                        "I would travel if I had more money.",
                        "She would pass if she studied harder.",
                        "We would meet often if they lived here."
                    ]
                },
                {
                    label: "Were",
                    formula: "If + Subject + were, would + V1",
                    examples: [
                        "If I were you, I would apologize.",
                        "If she were here, she would help us.",
                        "If they were ready, we would leave."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Formula",
            question: "Second Conditional uses...",
            options: [
                "If + Simple Past, would + V1",
                "If + Simple Present, will + V1",
                "If + Past Perfect, would have + V3",
                "If + Simple Present, Simple Present"
            ],
            answer: "If + Simple Past, would + V1",
            explanation: "Second Conditional memakai If + Simple Past, would + V1."
        },
        {
            type: "Hypothetical",
            question: "If I had more money, I ___ travel.",
            options: ["will", "would", "had", "am"],
            answer: "would",
            explanation: "Result clause Second Conditional memakai would + V1."
        },
        {
            type: "Hypothetical",
            question: "If she studied harder, she ___ pass.",
            options: ["will", "would", "has", "is"],
            answer: "would",
            explanation: "Second Conditional menunjukkan situasi hipotetis."
        },
        {
            type: "If Clause",
            question: "If they ___ here, we would meet often.",
            options: ["live", "lived", "will live", "living"],
            answer: "lived",
            explanation: "If-clause Second Conditional memakai Simple Past."
        },
        {
            type: "Were",
            question: "If I ___ you, I would apologize.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Dalam bentuk formal Second Conditional, gunakan were untuk semua subject."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If I have more money, I would travel.",
                "If I had more money, I would travel.",
                "If I had more money, I will travel.",
                "If I will have more money, I would travel."
            ],
            answer: "If I had more money, I would travel.",
            explanation: "Second Conditional memakai If + Simple Past, would + V1."
        },
        {
            type: "Concept",
            question: "Second Conditional is used for...",
            options: [
                "imaginary or unreal situations",
                "general facts",
                "real future possibilities",
                "completed past events"
            ],
            answer: "imaginary or unreal situations",
            explanation: "Second Conditional digunakan untuk situasi imajinatif atau tidak nyata."
        },
        {
            type: "Advice",
            question: "If I were you, I ___ accept the offer.",
            options: ["will", "would", "had", "am"],
            answer: "would",
            explanation: "If I were you sering digunakan untuk memberi saran."
        },
        {
            type: "Order",
            question: "Which sentence is also correct?",
            options: [
                "I would travel if I had more money.",
                "I travel would if I had more money.",
                "I will travel if I had more money.",
                "I would travelled if I had money."
            ],
            answer: "I would travel if I had more money.",
            explanation: "Result clause boleh muncul sebelum if-clause."
        },
        {
            type: "Verb Form",
            question: "After would, use...",
            options: ["V1", "V2", "V3", "V-ing"],
            answer: "V1",
            explanation: "Would selalu diikuti base verb atau V1."
        }
    ]
},

"third-conditional": {
    title: "Third Conditional",
    description: "Third Conditional digunakan untuk membicarakan situasi masa lampau yang tidak terjadi. Kalimat ini sering digunakan untuk penyesalan, kritik, atau membayangkan hasil berbeda di masa lalu.",

    formula: `
        <strong>Inti Materi:</strong><br>
        If + Past Perfect, Subject + would have + V3
    `,

    notes: [
        "Third Conditional digunakan untuk situasi masa lampau yang tidak nyata.",
        "If-clause memakai Past Perfect.",
        "Result clause memakai would have + V3.",
        "Third Conditional sering dipakai untuk penyesalan.",
        "Kalimat ini membicarakan hal yang sudah tidak bisa diubah."
    ],

    patterns: [
        {
            group: "Basic Form",
            items: [
                {
                    label: "If First",
                    formula: "If + had + V3, would have + V3",
                    examples: [
                        "If I had studied, I would have passed.",
                        "If she had left earlier, she would have arrived on time.",
                        "If they had invited me, I would have come."
                    ]
                },
                {
                    label: "Result First",
                    formula: "Would have + V3 + if + had + V3",
                    examples: [
                        "I would have passed if I had studied.",
                        "She would have arrived on time if she had left earlier.",
                        "I would have come if they had invited me."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Formula",
            question: "Third Conditional uses...",
            options: [
                "If + Past Perfect, would have + V3",
                "If + Simple Present, will + V1",
                "If + Simple Past, would + V1",
                "If + Simple Present, Simple Present"
            ],
            answer: "If + Past Perfect, would have + V3",
            explanation: "Third Conditional memakai If + Past Perfect, would have + V3."
        },
        {
            type: "Past Unreal",
            question: "If I had studied, I ___ passed.",
            options: ["will have", "would have", "would", "had"],
            answer: "would have",
            explanation: "Result clause Third Conditional memakai would have + V3."
        },
        {
            type: "Past Unreal",
            question: "If she had left earlier, she would have ___.",
            options: ["arrive", "arrives", "arrived", "arriving"],
            answer: "arrived",
            explanation: "Setelah would have, gunakan V3."
        },
        {
            type: "If Clause",
            question: "If they ___ me, I would have come.",
            options: ["invite", "invited", "had invited", "will invite"],
            answer: "had invited",
            explanation: "If-clause Third Conditional memakai had + V3."
        },
        {
            type: "Regret",
            question: "If I had known the answer, I ___ told you.",
            options: ["will have", "would have", "would", "had"],
            answer: "would have",
            explanation: "Kalimat ini membayangkan hasil berbeda di masa lalu."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If I studied, I would have passed.",
                "If I had studied, I would have passed.",
                "If I had studied, I would pass.",
                "If I have studied, I would have passed."
            ],
            answer: "If I had studied, I would have passed.",
            explanation: "Third Conditional memakai If + had + V3, would have + V3."
        },
        {
            type: "Concept",
            question: "Third Conditional is used for...",
            options: [
                "unreal past situations",
                "general facts",
                "real future possibilities",
                "present habits"
            ],
            answer: "unreal past situations",
            explanation: "Third Conditional digunakan untuk pengandaian masa lampau yang tidak terjadi."
        },
        {
            type: "Order",
            question: "Which sentence is also correct?",
            options: [
                "I would have passed if I had studied.",
                "I would passed if I had studied.",
                "I will have passed if I studied.",
                "I had passed if I would study."
            ],
            answer: "I would have passed if I had studied.",
            explanation: "Result clause boleh muncul sebelum if-clause."
        },
        {
            type: "Verb Form",
            question: "After would have, use...",
            options: ["V1", "V2", "V3", "V-ing"],
            answer: "V3",
            explanation: "Would have selalu diikuti V3."
        },
        {
            type: "Meaning",
            question: "If she had studied, she would have passed. This means...",
            options: [
                "She did not study and did not pass.",
                "She studies now.",
                "She will pass tomorrow.",
                "She always passes."
            ],
            answer: "She did not study and did not pass.",
            explanation: "Third Conditional menunjukkan kondisi lampau yang tidak terjadi."
        }
    ]
},

"mixed-conditional": {
    title: "Mixed Conditional",
    description: "Mixed Conditional digunakan ketika waktu pada condition dan result berbeda. Biasanya kalimat ini menghubungkan kondisi masa lampau dengan hasil sekarang, atau kondisi sekarang dengan hasil masa lampau.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Past condition → Present result:<br>
        If + Past Perfect, would + V1<br><br>
        Present condition → Past result:<br>
        If + Simple Past, would have + V3
    `,

    notes: [
        "Mixed Conditional menggabungkan dua waktu berbeda.",
        "Bentuk paling umum: kondisi masa lampau, hasil sekarang.",
        "If + Past Perfect, would + V1 berarti masa lalu memengaruhi sekarang.",
        "If + Simple Past, would have + V3 berarti kondisi sekarang memengaruhi kejadian masa lalu.",
        "Materi ini lebih advanced daripada Type 0, 1, 2, dan 3."
    ],

    patterns: [
        {
            group: "Past Condition → Present Result",
            items: [
                {
                    label: "Past to Present",
                    formula: "If + had + V3, would + V1",
                    examples: [
                        "If I had studied medicine, I would be a doctor now.",
                        "If she had saved money, she would be rich now.",
                        "If they had left earlier, they would be here now."
                    ]
                }
            ]
        },
        {
            group: "Present Condition → Past Result",
            items: [
                {
                    label: "Present to Past",
                    formula: "If + Simple Past, would have + V3",
                    examples: [
                        "If I were more careful, I would not have made that mistake.",
                        "If he knew English, he would have understood the movie.",
                        "If she were braver, she would have accepted the challenge."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Past to Present",
            question: "If I had studied medicine, I ___ a doctor now.",
            options: ["will be", "would be", "would have been", "am"],
            answer: "would be",
            explanation: "Past condition dengan present result memakai would + V1."
        },
        {
            type: "Past to Present",
            question: "If she had saved money, she ___ rich now.",
            options: ["would be", "would have been", "will be", "has been"],
            answer: "would be",
            explanation: "Kondisi masa lampau memengaruhi hasil sekarang."
        },
        {
            type: "Past to Present",
            question: "If they had left earlier, they ___ here now.",
            options: ["would be", "would have been", "will be", "are"],
            answer: "would be",
            explanation: "Had left adalah past condition, here now adalah present result."
        },
        {
            type: "Past Condition",
            question: "If I ___ harder, I would be successful now.",
            options: ["study", "studied", "had studied", "will study"],
            answer: "had studied",
            explanation: "Untuk kondisi masa lampau, gunakan had + V3."
        },
        {
            type: "Present to Past",
            question: "If I were more careful, I ___ that mistake.",
            options: ["would not make", "would not have made", "will not make", "did not make"],
            answer: "would not have made",
            explanation: "Present condition dengan past result memakai would have + V3."
        },
        {
            type: "Present to Past",
            question: "If he knew English, he ___ the movie.",
            options: ["would understand", "would have understood", "will understand", "understood"],
            answer: "would have understood",
            explanation: "Kondisi sekarang memengaruhi hasil masa lampau."
        },
        {
            type: "Concept",
            question: "Mixed Conditional usually combines...",
            options: [
                "different time references",
                "only present time",
                "only future time",
                "only articles"
            ],
            answer: "different time references",
            explanation: "Mixed Conditional menggabungkan condition dan result dari waktu berbeda."
        },
        {
            type: "Formula",
            question: "Past condition → Present result uses...",
            options: [
                "If + had + V3, would + V1",
                "If + Simple Present, will + V1",
                "If + Simple Past, would have + V3",
                "If + Simple Present, Simple Present"
            ],
            answer: "If + had + V3, would + V1",
            explanation: "Ini pola mixed conditional paling umum."
        },
        {
            type: "Formula",
            question: "Present condition → Past result uses...",
            options: [
                "If + Simple Past, would have + V3",
                "If + Past Perfect, would + V1",
                "If + Simple Present, will + V1",
                "If + Simple Present, Simple Present"
            ],
            answer: "If + Simple Past, would have + V3",
            explanation: "Kondisi sekarang dengan hasil lampau memakai Simple Past + would have V3."
        },
        {
            type: "Meaning",
            question: "If I had studied medicine, I would be a doctor now. This means...",
            options: [
                "I did not study medicine, so I am not a doctor now.",
                "I am studying medicine now.",
                "I will become a doctor tomorrow.",
                "I was a doctor yesterday."
            ],
            answer: "I did not study medicine, so I am not a doctor now.",
            explanation: "Kalimat ini menunjukkan penyesalan masa lampau dengan akibat sekarang."
        }
    ]
},

"conditional-review": {
    title: "Conditional Review",
    description: "Conditional Review adalah latihan akhir untuk menguji pemahaman Zero, First, Second, Third, dan Mixed Conditional.",

    formula: `
        <strong>Ringkasan BAB 7:</strong><br>
        Zero = If + Simple Present, Simple Present<br>
        First = If + Simple Present, will + V1<br>
        Second = If + Simple Past, would + V1<br>
        Third = If + Past Perfect, would have + V3<br>
        Mixed = gabungan waktu berbeda
    `,

    notes: [
        "Zero Conditional digunakan untuk fakta umum.",
        "First Conditional digunakan untuk kemungkinan nyata di masa depan.",
        "Second Conditional digunakan untuk situasi imajinatif sekarang/masa depan.",
        "Third Conditional digunakan untuk pengandaian masa lampau yang tidak terjadi.",
        "Mixed Conditional menggabungkan waktu berbeda antara condition dan result."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Zero / First",
                    formula: "Present → Present / Future",
                    examples: [
                        "If water reaches 100°C, it boils.",
                        "If it rains, I will stay home."
                    ]
                },
                {
                    label: "Second / Third",
                    formula: "Past → Would / Past Perfect → Would Have",
                    examples: [
                        "If I had money, I would travel.",
                        "If I had studied, I would have passed."
                    ]
                },
                {
                    label: "Mixed",
                    formula: "Different time references",
                    examples: [
                        "If I had studied medicine, I would be a doctor now.",
                        "If I were more careful, I would not have made that mistake."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Zero",
            question: "If water reaches 100°C, it ___.",
            options: ["boils", "will boil", "would boil", "would have boiled"],
            answer: "boils",
            explanation: "Zero Conditional memakai Simple Present di kedua clause."
        },
        {
            type: "Zero",
            question: "If you heat ice, it ___.",
            options: ["melts", "will melt", "would melt", "melted"],
            answer: "melts",
            explanation: "Ini fakta umum, jadi gunakan Zero Conditional."
        },
        {
            type: "First",
            question: "If it rains tomorrow, I ___ stay home.",
            options: ["will", "would", "would have", "had"],
            answer: "will",
            explanation: "First Conditional memakai will + V1 pada result clause."
        },
        {
            type: "First",
            question: "If she ___ hard, she will pass.",
            options: ["studies", "studied", "had studied", "will study"],
            answer: "studies",
            explanation: "If-clause First Conditional memakai Simple Present."
        },
        {
            type: "Second",
            question: "If I had more money, I ___ travel.",
            options: ["will", "would", "would have", "had"],
            answer: "would",
            explanation: "Second Conditional memakai would + V1."
        },
        {
            type: "Second",
            question: "If I ___ you, I would apologize.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Dalam bentuk formal, gunakan were untuk semua subject."
        },
        {
            type: "Third",
            question: "If I had studied, I ___ passed.",
            options: ["will have", "would have", "would", "had"],
            answer: "would have",
            explanation: "Third Conditional memakai would have + V3."
        },
        {
            type: "Third",
            question: "If she ___ earlier, she would have arrived on time.",
            options: ["leaves", "left", "had left", "will leave"],
            answer: "had left",
            explanation: "If-clause Third Conditional memakai had + V3."
        },
        {
            type: "Mixed",
            question: "If I had studied medicine, I ___ a doctor now.",
            options: ["will be", "would be", "would have been", "am"],
            answer: "would be",
            explanation: "Mixed Conditional: past condition dengan present result."
        },
        {
            type: "Mixed",
            question: "If I were more careful, I ___ that mistake.",
            options: ["would not make", "would not have made", "will not make", "did not make"],
            answer: "would not have made",
            explanation: "Mixed Conditional: present condition dengan past result."
        },
        {
            type: "Formula",
            question: "Which formula is First Conditional?",
            options: [
                "If + Simple Present, will + V1",
                "If + Simple Past, would + V1",
                "If + Past Perfect, would have + V3",
                "If + Simple Present, Simple Present"
            ],
            answer: "If + Simple Present, will + V1",
            explanation: "First Conditional memakai Simple Present + will."
        },
        {
            type: "Formula",
            question: "Which formula is Third Conditional?",
            options: [
                "If + Simple Present, will + V1",
                "If + Simple Past, would + V1",
                "If + Past Perfect, would have + V3",
                "If + Simple Present, Simple Present"
            ],
            answer: "If + Past Perfect, would have + V3",
            explanation: "Third Conditional memakai had + V3 dan would have + V3."
        },
        {
            type: "Meaning",
            question: "If I had studied, I would have passed. This means...",
            options: [
                "I did not study and I did not pass.",
                "I study every day.",
                "I will pass tomorrow.",
                "I am passing now."
            ],
            answer: "I did not study and I did not pass.",
            explanation: "Third Conditional menunjukkan pengandaian masa lampau yang tidak terjadi."
        },
        {
            type: "Meaning",
            question: "If I had more time, I would learn French. This is...",
            options: [
                "real future possibility",
                "imaginary present/future situation",
                "general fact",
                "completed past event"
            ],
            answer: "imaginary present/future situation",
            explanation: "Second Conditional digunakan untuk situasi imajinatif."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If it will rain, I will stay home.",
                "If it rains, I will stay home.",
                "If it rained, I will stay home.",
                "If it rains, I would stay home."
            ],
            answer: "If it rains, I will stay home.",
            explanation: "First Conditional tidak memakai will di if-clause."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If I have money, I would travel.",
                "If I had money, I would travel.",
                "If I had money, I will travel.",
                "If I will have money, I would travel."
            ],
            answer: "If I had money, I would travel.",
            explanation: "Second Conditional memakai Simple Past + would."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If she had called, I would answer.",
                "If she called, I would have answered.",
                "If she had called, I would have answered.",
                "If she has called, I would have answered."
            ],
            answer: "If she had called, I would have answered.",
            explanation: "Third Conditional memakai had + V3 dan would have + V3."
        },
        {
            type: "Concept",
            question: "Which conditional is used for general facts?",
            options: ["Zero", "First", "Second", "Third"],
            answer: "Zero",
            explanation: "Zero Conditional digunakan untuk fakta umum."
        },
        {
            type: "Concept",
            question: "Which conditional is used for real future possibilities?",
            options: ["Zero", "First", "Second", "Third"],
            answer: "First",
            explanation: "First Conditional digunakan untuk kemungkinan nyata di masa depan."
        },
        {
            type: "Concept",
            question: "Which conditional is used for unreal past situations?",
            options: ["Zero", "First", "Second", "Third"],
            answer: "Third",
            explanation: "Third Conditional digunakan untuk situasi masa lampau yang tidak terjadi."
        }
    ]
},

"reported-speech": {
    title: "Introduction to Reported Speech",
    description: "Reported Speech digunakan untuk menyampaikan kembali ucapan seseorang tanpa mengutip kata-katanya secara langsung.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Direct Speech: He said, "I am tired."<br>
        Reported Speech: He said that he was tired.
    `,

    notes: [
        "Direct Speech mengutip ucapan asli secara langsung.",
        "Reported Speech menyampaikan ulang ucapan tanpa tanda kutip.",
        "Pronoun sering berubah sesuai pembicara.",
        "Tense sering mundur satu langkah jika reporting verb berbentuk past.",
        "That sering digunakan, tetapi dalam percakapan bisa dihilangkan."
    ],

    patterns: [
        {
            group: "Basic",
            items: [
                {
                    label: "Direct Speech",
                    formula: "Subject + said, \"sentence\"",
                    examples: [
                        "He said, \"I am tired.\"",
                        "She said, \"I like English.\"",
                        "They said, \"We are ready.\""
                    ]
                },
                {
                    label: "Reported Speech",
                    formula: "Subject + said that + reported clause",
                    examples: [
                        "He said that he was tired.",
                        "She said that she liked English.",
                        "They said that they were ready."
                    ]
                }
            ]
        },
        {
            group: "Main Changes",
            items: [
                {
                    label: "Pronoun Change",
                    formula: "I → he/she, we → they",
                    examples: [
                        "Direct: She said, \"I am happy.\"",
                        "Reported: She said that she was happy."
                    ]
                },
                {
                    label: "Tense Change",
                    formula: "Present → Past",
                    examples: [
                        "Direct: He said, \"I work here.\"",
                        "Reported: He said that he worked there."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Reported Speech is used to...",
            options: [
                "repeat someone's words indirectly",
                "make passive voice",
                "describe nouns",
                "show quantity"
            ],
            answer: "repeat someone's words indirectly",
            explanation: "Reported Speech digunakan untuk menyampaikan ulang ucapan seseorang secara tidak langsung."
        },
        {
            type: "Direct vs Reported",
            question: "Which one is Direct Speech?",
            options: [
                "He said that he was tired.",
                "He said, \"I am tired.\"",
                "He was tired.",
                "He had been tired."
            ],
            answer: "He said, \"I am tired.\"",
            explanation: "Direct Speech memakai tanda kutip dan ucapan asli."
        },
        {
            type: "Direct vs Reported",
            question: "Which one is Reported Speech?",
            options: [
                "She said, \"I am happy.\"",
                "She said that she was happy.",
                "I am happy.",
                "\"She is happy.\""
            ],
            answer: "She said that she was happy.",
            explanation: "Reported Speech menyampaikan ulang tanpa tanda kutip."
        },
        {
            type: "Pronoun",
            question: "Direct: She said, \"I am tired.\" Reported: She said that ___ was tired.",
            options: ["I", "she", "he", "they"],
            answer: "she",
            explanation: "I berubah menjadi she karena pembicaranya adalah She."
        },
        {
            type: "Tense",
            question: "Direct: He said, \"I work here.\" Reported: He said that he ___ there.",
            options: ["work", "works", "worked", "working"],
            answer: "worked",
            explanation: "Simple Present biasanya berubah menjadi Simple Past."
        },
        {
            type: "Concept",
            question: "Reported Speech usually removes...",
            options: ["quotation marks", "subjects", "verbs", "nouns"],
            answer: "quotation marks",
            explanation: "Reported Speech tidak memakai tanda kutip langsung."
        },
        {
            type: "Concept",
            question: "The word 'that' in reported speech is...",
            options: [
                "often optional",
                "always impossible",
                "an article",
                "a modal"
            ],
            answer: "often optional",
            explanation: "That sering digunakan, tetapi dalam percakapan bisa dihilangkan."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "He said that he was tired.",
                "He said that I was tired. (if he refers to himself)",
                "He said he is tired yesterday.",
                "He said, that he was tired."
            ],
            answer: "He said that he was tired.",
            explanation: "Pronoun dan tense harus disesuaikan."
        },
        {
            type: "Concept",
            question: "If the reporting verb is past, tense often...",
            options: ["moves back", "moves forward", "disappears", "becomes article"],
            answer: "moves back",
            explanation: "Jika reporting verb berbentuk past, tense biasanya mengalami backshift."
        },
        {
            type: "Concept",
            question: "Reported Speech is also called...",
            options: ["Indirect Speech", "Passive Speech", "Zero Article", "Modal Passive"],
            answer: "Indirect Speech",
            explanation: "Reported Speech juga disebut Indirect Speech."
        }
    ]
},

"reported-statements": {
    title: "Reported Statements",
    description: "Reported Statements digunakan untuk melaporkan pernyataan seseorang. Dalam reported statement, tanda kutip dihilangkan, pronoun disesuaikan, dan tense biasanya mengalami backshift jika reporting verb berbentuk past.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subject + said/told + that + reported clause
    `,

    notes: [
        "Gunakan said jika tidak menyebut object orang yang diajak bicara.",
        "Gunakan told jika menyebut object orang yang diajak bicara.",
        "Direct statement berubah menjadi reported statement tanpa tanda kutip.",
        "Pronoun harus disesuaikan dengan konteks.",
        "Jika reporting verb berbentuk past, tense biasanya mundur satu langkah."
    ],

    patterns: [
        {
            group: "Said",
            items: [
                {
                    label: "Said That",
                    formula: "Subject + said that + clause",
                    examples: [
                        "Direct: He said, \"I am tired.\"",
                        "Reported: He said that he was tired.",
                        "Direct: She said, \"I like English.\"",
                        "Reported: She said that she liked English."
                    ]
                }
            ]
        },
        {
            group: "Told",
            items: [
                {
                    label: "Told Object That",
                    formula: "Subject + told + object + that + clause",
                    examples: [
                        "Direct: He said to me, \"I am busy.\"",
                        "Reported: He told me that he was busy.",
                        "Direct: She said to him, \"I need help.\"",
                        "Reported: She told him that she needed help."
                    ]
                }
            ]
        },
        {
            group: "Backshift",
            items: [
                {
                    label: "Present to Past",
                    formula: "Simple Present → Simple Past",
                    examples: [
                        "Direct: He said, \"I work here.\"",
                        "Reported: He said that he worked there.",
                        "Direct: She said, \"I live in Jakarta.\"",
                        "Reported: She said that she lived in Jakarta."
                    ]
                },
                {
                    label: "Present Continuous to Past Continuous",
                    formula: "am/is/are + V-ing → was/were + V-ing",
                    examples: [
                        "Direct: She said, \"I am studying.\"",
                        "Reported: She said that she was studying.",
                        "Direct: They said, \"We are waiting.\"",
                        "Reported: They said that they were waiting."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Said",
            question: "Direct: He said, \"I am tired.\" Reported: He said that he ___ tired.",
            options: ["is", "was", "were", "be"],
            answer: "was",
            explanation: "Am berubah menjadi was karena reporting verb said berbentuk past."
        },
        {
            type: "Said",
            question: "Direct: She said, \"I like English.\" Reported: She said that she ___ English.",
            options: ["like", "likes", "liked", "liking"],
            answer: "liked",
            explanation: "Simple Present berubah menjadi Simple Past."
        },
        {
            type: "Told",
            question: "He said to me, \"I am busy.\" Reported form is...",
            options: [
                "He told me that he was busy.",
                "He told that he was busy.",
                "He said me that he was busy.",
                "He told me that I was busy."
            ],
            answer: "He told me that he was busy.",
            explanation: "Told harus diikuti object, dan pronoun disesuaikan."
        },
        {
            type: "Pronoun",
            question: "Direct: Rina said, \"I am happy.\" Reported: Rina said that ___ was happy.",
            options: ["I", "she", "he", "they"],
            answer: "she",
            explanation: "I berubah menjadi she karena pembicaranya Rina."
        },
        {
            type: "Pronoun",
            question: "Direct: They said, \"We are ready.\" Reported: They said that ___ were ready.",
            options: ["we", "they", "he", "she"],
            answer: "they",
            explanation: "We berubah menjadi they."
        },
        {
            type: "Backshift",
            question: "Direct: She said, \"I am studying.\" Reported: She said that she ___ studying.",
            options: ["is", "are", "was", "were"],
            answer: "was",
            explanation: "Present Continuous berubah menjadi Past Continuous."
        },
        {
            type: "Backshift",
            question: "Direct: They said, \"We are waiting.\" Reported: They said that they ___ waiting.",
            options: ["are", "is", "was", "were"],
            answer: "were",
            explanation: "Are berubah menjadi were."
        },
        {
            type: "Said/Told",
            question: "Which sentence is correct?",
            options: [
                "She said me that she was tired.",
                "She told me that she was tired.",
                "She told that she was tired.",
                "She said to me that I was tired."
            ],
            answer: "She told me that she was tired.",
            explanation: "Gunakan told + object."
        },
        {
            type: "Concept",
            question: "Reported statements usually remove...",
            options: ["quotation marks", "all verbs", "subjects", "nouns"],
            answer: "quotation marks",
            explanation: "Reported Speech tidak memakai tanda kutip langsung."
        },
        {
            type: "Concept",
            question: "When using told, we need...",
            options: ["an object", "a modal only", "an article only", "a preposition only"],
            answer: "an object",
            explanation: "Told biasanya diikuti object seperti me, him, her, them."
        }
    ]
},

"reported-questions": {
    title: "Reported Questions",
    description: "Reported Questions digunakan untuk melaporkan pertanyaan seseorang. Dalam reported questions, struktur kalimat berubah menjadi urutan statement, bukan lagi bentuk pertanyaan.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Yes/No Question → asked if/whether + subject + verb<br>
        WH Question → asked + WH word + subject + verb
    `,

    notes: [
        "Reported questions tidak memakai tanda tanya.",
        "Urutan kata berubah menjadi subject + verb.",
        "Yes/No question memakai if atau whether.",
        "WH question tetap memakai kata tanya seperti what, where, why, when, how.",
        "Do/does/did biasanya hilang dalam reported question.",
        "Tense biasanya mengalami backshift jika reporting verb berbentuk past."
    ],

    patterns: [
        {
            group: "Yes / No Questions",
            items: [
                {
                    label: "If / Whether",
                    formula: "asked + if/whether + subject + verb",
                    examples: [
                        "Direct: He asked, \"Are you tired?\"",
                        "Reported: He asked if I was tired.",
                        "Direct: She asked, \"Do you like English?\"",
                        "Reported: She asked whether I liked English."
                    ]
                }
            ]
        },
        {
            group: "WH Questions",
            items: [
                {
                    label: "WH Word",
                    formula: "asked + WH word + subject + verb",
                    examples: [
                        "Direct: He asked, \"Where do you live?\"",
                        "Reported: He asked where I lived.",
                        "Direct: She asked, \"What are you doing?\"",
                        "Reported: She asked what I was doing."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Yes/No",
            question: "Direct: He asked, \"Are you tired?\" Reported: He asked if I ___ tired.",
            options: ["am", "is", "was", "were"],
            answer: "was",
            explanation: "Are berubah menjadi was sesuai subject I dan backshift."
        },
        {
            type: "Yes/No",
            question: "Direct: She asked, \"Do you like English?\" Reported: She asked if I ___ English.",
            options: ["like", "likes", "liked", "liking"],
            answer: "liked",
            explanation: "Do hilang dan Simple Present berubah menjadi Simple Past."
        },
        {
            type: "Yes/No",
            question: "Yes/No reported questions use...",
            options: ["if/whether", "because", "although", "the"],
            answer: "if/whether",
            explanation: "Yes/No question dilaporkan dengan if atau whether."
        },
        {
            type: "WH",
            question: "Direct: He asked, \"Where do you live?\" Reported: He asked where I ___.",
            options: ["live", "lives", "lived", "living"],
            answer: "lived",
            explanation: "Do hilang dan verb berubah ke past."
        },
        {
            type: "WH",
            question: "Direct: She asked, \"What are you doing?\" Reported: She asked what I ___ doing.",
            options: ["am", "is", "was", "were"],
            answer: "was",
            explanation: "Present Continuous berubah menjadi Past Continuous."
        },
        {
            type: "Word Order",
            question: "Which reported question has correct word order?",
            options: [
                "He asked where did I live.",
                "He asked where I lived.",
                "He asked where do I live.",
                "He asked where lived I."
            ],
            answer: "He asked where I lived.",
            explanation: "Reported question memakai urutan statement: subject + verb."
        },
        {
            type: "Punctuation",
            question: "Reported questions usually end with...",
            options: ["period", "question mark", "exclamation mark", "comma only"],
            answer: "period",
            explanation: "Reported questions biasanya menjadi statement dan berakhir dengan titik."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She asked if I was ready.",
                "She asked was I ready.",
                "She asked if was I ready.",
                "She asked if am I ready."
            ],
            answer: "She asked if I was ready.",
            explanation: "Gunakan if + subject + verb."
        },
        {
            type: "WH",
            question: "Direct: They asked, \"Why are you late?\" Reported: They asked why I ___ late.",
            options: ["am", "was", "were", "be"],
            answer: "was",
            explanation: "Are berubah menjadi was sesuai subject I."
        },
        {
            type: "Concept",
            question: "In reported questions, do/does/did usually...",
            options: ["disappear", "stay before subject", "become articles", "become nouns"],
            answer: "disappear",
            explanation: "Dalam reported question, auxiliary do/does/did biasanya hilang."
        }
    ]
},

"reported-commands": {
    title: "Reported Commands",
    description: "Reported Commands digunakan untuk melaporkan perintah, instruksi, permintaan, atau larangan dari seseorang.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Positive Command = told/asked + object + to + V1<br>
        Negative Command = told/asked + object + not to + V1
    `,

    notes: [
        "Perintah positif memakai to + V1.",
        "Perintah negatif memakai not to + V1.",
        "Gunakan told untuk perintah yang lebih tegas.",
        "Gunakan asked untuk permintaan yang lebih sopan.",
        "Reported commands tidak memakai tanda kutip.",
        "Subject dalam direct command biasanya tidak disebutkan, tetapi object harus muncul dalam reported command."
    ],

    patterns: [
        {
            group: "Positive Command",
            items: [
                {
                    label: "Told",
                    formula: "Subject + told + object + to + V1",
                    examples: [
                        "Direct: He said, \"Close the door.\"",
                        "Reported: He told me to close the door.",
                        "Direct: She said, \"Study hard.\"",
                        "Reported: She told him to study hard."
                    ]
                },
                {
                    label: "Asked",
                    formula: "Subject + asked + object + to + V1",
                    examples: [
                        "Direct: She said, \"Please help me.\"",
                        "Reported: She asked me to help her.",
                        "Direct: He said, \"Please wait here.\"",
                        "Reported: He asked us to wait there."
                    ]
                }
            ]
        },
        {
            group: "Negative Command",
            items: [
                {
                    label: "Not To",
                    formula: "Subject + told/asked + object + not to + V1",
                    examples: [
                        "Direct: He said, \"Don't smoke here.\"",
                        "Reported: He told me not to smoke there.",
                        "Direct: She said, \"Don't be late.\"",
                        "Reported: She told him not to be late."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Positive Command",
            question: "Direct: He said, \"Close the door.\" Reported: He told me ___ the door.",
            options: ["close", "closing", "to close", "closed"],
            answer: "to close",
            explanation: "Reported command positif memakai told + object + to + V1."
        },
        {
            type: "Positive Command",
            question: "Direct: She said, \"Study hard.\" Reported: She told him ___ hard.",
            options: ["study", "studying", "to study", "studied"],
            answer: "to study",
            explanation: "Gunakan to + V1 setelah told + object."
        },
        {
            type: "Request",
            question: "Direct: She said, \"Please help me.\" Reported: She asked me ___ her.",
            options: ["help", "helping", "to help", "helped"],
            answer: "to help",
            explanation: "Permintaan sopan dapat dilaporkan dengan asked + object + to + V1."
        },
        {
            type: "Negative Command",
            question: "Direct: He said, \"Don't smoke here.\" Reported: He told me ___ smoke there.",
            options: ["not", "not to", "to not", "don't"],
            answer: "not to",
            explanation: "Reported command negatif memakai not to + V1."
        },
        {
            type: "Negative Command",
            question: "Direct: She said, \"Don't be late.\" Reported: She told him ___ late.",
            options: ["not be", "not to be", "to not was", "don't be"],
            answer: "not to be",
            explanation: "Negative command memakai told + object + not to + V1."
        },
        {
            type: "Concept",
            question: "Reported commands use...",
            options: [
                "to + V1",
                "V2",
                "will + V1",
                "have + V3"
            ],
            answer: "to + V1",
            explanation: "Reported command positif memakai to + V1."
        },
        {
            type: "Concept",
            question: "Negative reported commands use...",
            options: [
                "not to + V1",
                "do not + V1 only",
                "did not + V1",
                "not + V2"
            ],
            answer: "not to + V1",
            explanation: "Bentuk negatifnya adalah not to + V1."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "He told me close the door.",
                "He told me to close the door.",
                "He told me closing the door.",
                "He told me closed the door."
            ],
            answer: "He told me to close the door.",
            explanation: "Reported command memakai told + object + to + V1."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She told him don't be late.",
                "She told him not be late.",
                "She told him not to be late.",
                "She told him to not was late."
            ],
            answer: "She told him not to be late.",
            explanation: "Negative command memakai not to + V1."
        },
        {
            type: "Told/Asked",
            question: "Which verb is softer and more polite?",
            options: ["asked", "told", "ordered", "commanded"],
            answer: "asked",
            explanation: "Asked lebih sopan untuk permintaan."
        }
    ]
},

"reported-commands": {
    title: "Reported Commands",
    description: "Reported Commands digunakan untuk melaporkan perintah, instruksi, permintaan, atau larangan dari seseorang.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Positive Command = told/asked + object + to + V1<br>
        Negative Command = told/asked + object + not to + V1
    `,

    notes: [
        "Perintah positif memakai to + V1.",
        "Perintah negatif memakai not to + V1.",
        "Gunakan told untuk perintah yang lebih tegas.",
        "Gunakan asked untuk permintaan yang lebih sopan.",
        "Reported commands tidak memakai tanda kutip.",
        "Subject dalam direct command biasanya tidak disebutkan, tetapi object harus muncul dalam reported command."
    ],

    patterns: [
        {
            group: "Positive Command",
            items: [
                {
                    label: "Told",
                    formula: "Subject + told + object + to + V1",
                    examples: [
                        "Direct: He said, \"Close the door.\"",
                        "Reported: He told me to close the door.",
                        "Direct: She said, \"Study hard.\"",
                        "Reported: She told him to study hard."
                    ]
                },
                {
                    label: "Asked",
                    formula: "Subject + asked + object + to + V1",
                    examples: [
                        "Direct: She said, \"Please help me.\"",
                        "Reported: She asked me to help her.",
                        "Direct: He said, \"Please wait here.\"",
                        "Reported: He asked us to wait there."
                    ]
                }
            ]
        },
        {
            group: "Negative Command",
            items: [
                {
                    label: "Not To",
                    formula: "Subject + told/asked + object + not to + V1",
                    examples: [
                        "Direct: He said, \"Don't smoke here.\"",
                        "Reported: He told me not to smoke there.",
                        "Direct: She said, \"Don't be late.\"",
                        "Reported: She told him not to be late."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Positive Command",
            question: "Direct: He said, \"Close the door.\" Reported: He told me ___ the door.",
            options: ["close", "closing", "to close", "closed"],
            answer: "to close",
            explanation: "Reported command positif memakai told + object + to + V1."
        },
        {
            type: "Positive Command",
            question: "Direct: She said, \"Study hard.\" Reported: She told him ___ hard.",
            options: ["study", "studying", "to study", "studied"],
            answer: "to study",
            explanation: "Gunakan to + V1 setelah told + object."
        },
        {
            type: "Request",
            question: "Direct: She said, \"Please help me.\" Reported: She asked me ___ her.",
            options: ["help", "helping", "to help", "helped"],
            answer: "to help",
            explanation: "Permintaan sopan dapat dilaporkan dengan asked + object + to + V1."
        },
        {
            type: "Negative Command",
            question: "Direct: He said, \"Don't smoke here.\" Reported: He told me ___ smoke there.",
            options: ["not", "not to", "to not", "don't"],
            answer: "not to",
            explanation: "Reported command negatif memakai not to + V1."
        },
        {
            type: "Negative Command",
            question: "Direct: She said, \"Don't be late.\" Reported: She told him ___ late.",
            options: ["not be", "not to be", "to not was", "don't be"],
            answer: "not to be",
            explanation: "Negative command memakai told + object + not to + V1."
        },
        {
            type: "Concept",
            question: "Reported commands use...",
            options: [
                "to + V1",
                "V2",
                "will + V1",
                "have + V3"
            ],
            answer: "to + V1",
            explanation: "Reported command positif memakai to + V1."
        },
        {
            type: "Concept",
            question: "Negative reported commands use...",
            options: [
                "not to + V1",
                "do not + V1 only",
                "did not + V1",
                "not + V2"
            ],
            answer: "not to + V1",
            explanation: "Bentuk negatifnya adalah not to + V1."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "He told me close the door.",
                "He told me to close the door.",
                "He told me closing the door.",
                "He told me closed the door."
            ],
            answer: "He told me to close the door.",
            explanation: "Reported command memakai told + object + to + V1."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She told him don't be late.",
                "She told him not be late.",
                "She told him not to be late.",
                "She told him to not was late."
            ],
            answer: "She told him not to be late.",
            explanation: "Negative command memakai not to + V1."
        },
        {
            type: "Told/Asked",
            question: "Which verb is softer and more polite?",
            options: ["asked", "told", "ordered", "commanded"],
            answer: "asked",
            explanation: "Asked lebih sopan untuk permintaan."
        }
    ]
}, 

"backshift": {
    title: "Backshift",
    description: "Backshift adalah perubahan tense dalam reported speech. Jika reporting verb berbentuk past seperti said, told, atau asked, tense dalam ucapan asli biasanya mundur satu langkah.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Simple Present → Simple Past<br>
        Present Continuous → Past Continuous<br>
        Present Perfect → Past Perfect<br>
        Simple Past → Past Perfect<br>
        will → would<br>
        can → could
    `,

    notes: [
        "Backshift terjadi ketika reporting verb berbentuk past.",
        "Simple Present biasanya berubah menjadi Simple Past.",
        "Present Continuous berubah menjadi Past Continuous.",
        "Present Perfect berubah menjadi Past Perfect.",
        "Simple Past sering berubah menjadi Past Perfect.",
        "Will berubah menjadi would.",
        "Can berubah menjadi could.",
        "Backshift tidak selalu wajib jika ucapan masih benar sampai sekarang."
    ],

    patterns: [
        {
            group: "Present to Past",
            items: [
                {
                    label: "Simple Present",
                    formula: "Simple Present → Simple Past",
                    examples: [
                        "Direct: He said, \"I work here.\"",
                        "Reported: He said that he worked there.",
                        "Direct: She said, \"I like coffee.\"",
                        "Reported: She said that she liked coffee."
                    ]
                },
                {
                    label: "Present Continuous",
                    formula: "am/is/are + V-ing → was/were + V-ing",
                    examples: [
                        "Direct: She said, \"I am studying.\"",
                        "Reported: She said that she was studying.",
                        "Direct: They said, \"We are waiting.\"",
                        "Reported: They said that they were waiting."
                    ]
                }
            ]
        },
        {
            group: "Perfect / Past",
            items: [
                {
                    label: "Present Perfect",
                    formula: "have/has + V3 → had + V3",
                    examples: [
                        "Direct: He said, \"I have finished.\"",
                        "Reported: He said that he had finished.",
                        "Direct: She said, \"I have eaten.\"",
                        "Reported: She said that she had eaten."
                    ]
                },
                {
                    label: "Simple Past",
                    formula: "Simple Past → Past Perfect",
                    examples: [
                        "Direct: She said, \"I saw him.\"",
                        "Reported: She said that she had seen him.",
                        "Direct: He said, \"I bought a car.\"",
                        "Reported: He said that he had bought a car."
                    ]
                }
            ]
        },
        {
            group: "Modal Backshift",
            items: [
                {
                    label: "Will / Can",
                    formula: "will → would, can → could",
                    examples: [
                        "Direct: He said, \"I will call you.\"",
                        "Reported: He said that he would call me.",
                        "Direct: She said, \"I can swim.\"",
                        "Reported: She said that she could swim."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Present",
            question: "Direct: He said, \"I work here.\" Reported: He said that he ___ there.",
            options: ["work", "works", "worked", "working"],
            answer: "worked",
            explanation: "Simple Present berubah menjadi Simple Past."
        },
        {
            type: "Present Continuous",
            question: "Direct: She said, \"I am studying.\" Reported: She said that she ___ studying.",
            options: ["am", "is", "was", "were"],
            answer: "was",
            explanation: "Present Continuous berubah menjadi Past Continuous."
        },
        {
            type: "Present Perfect",
            question: "Direct: He said, \"I have finished.\" Reported: He said that he ___ finished.",
            options: ["has", "have", "had", "was"],
            answer: "had",
            explanation: "Present Perfect berubah menjadi Past Perfect."
        },
        {
            type: "Simple Past",
            question: "Direct: She said, \"I saw him.\" Reported: She said that she ___ him.",
            options: ["saw", "seen", "had seen", "has seen"],
            answer: "had seen",
            explanation: "Simple Past sering berubah menjadi Past Perfect."
        },
        {
            type: "Will",
            question: "Direct: He said, \"I will call you.\" Reported: He said that he ___ call me.",
            options: ["will", "would", "can", "could"],
            answer: "would",
            explanation: "Will berubah menjadi would."
        },
        {
            type: "Can",
            question: "Direct: She said, \"I can swim.\" Reported: She said that she ___ swim.",
            options: ["can", "could", "will", "would"],
            answer: "could",
            explanation: "Can berubah menjadi could."
        },
        {
            type: "Concept",
            question: "Backshift usually happens when the reporting verb is...",
            options: ["past", "future", "plural", "article"],
            answer: "past",
            explanation: "Backshift biasanya terjadi jika reporting verb berbentuk past."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "He said that he work there.",
                "He said that he worked there.",
                "He said that he working there.",
                "He said that he works there yesterday."
            ],
            answer: "He said that he worked there.",
            explanation: "Simple Present dalam direct speech berubah menjadi Simple Past."
        },
        {
            type: "Modal",
            question: "Which backshift is correct?",
            options: [
                "will → would",
                "will → can",
                "can → will",
                "would → will"
            ],
            answer: "will → would",
            explanation: "Dalam reported speech, will biasanya berubah menjadi would."
        },
        {
            type: "Concept",
            question: "Backshift means...",
            options: [
                "moving the tense one step back",
                "removing all verbs",
                "changing nouns to adjectives",
                "adding articles"
            ],
            answer: "moving the tense one step back",
            explanation: "Backshift berarti tense mundur satu langkah."
        }
    ]
},

"reporting-verbs": {
    title: "Reporting Verbs",
    description: "Reporting verbs adalah kata kerja yang digunakan untuk melaporkan ucapan, perintah, saran, janji, atau permintaan seseorang. Selain said, told, dan asked, ada banyak reporting verbs lain seperti advised, promised, warned, suggested, dan ordered.",

    formula: `
        <strong>Inti Materi:</strong><br>
        reporting verb + object + to + V1<br>
        reporting verb + gerund<br>
        reporting verb + that + clause
    `,

    notes: [
        "Said digunakan untuk melaporkan ucapan umum.",
        "Told membutuhkan object, seperti told me, told him, told them.",
        "Asked dapat digunakan untuk pertanyaan atau permintaan.",
        "Advised, warned, ordered, reminded biasanya memakai object + to + V1.",
        "Suggested dapat memakai gerund atau that-clause.",
        "Promised biasanya memakai to + V1 atau that-clause."
    ],

    patterns: [
        {
            group: "Verb + Object + To",
            items: [
                {
                    label: "Advise / Warn / Remind",
                    formula: "verb + object + to + V1",
                    examples: [
                        "She advised me to study harder.",
                        "He warned us not to touch the wire.",
                        "They reminded him to bring his book."
                    ]
                },
                {
                    label: "Order / Tell / Ask",
                    formula: "verb + object + to + V1",
                    examples: [
                        "The teacher told us to sit down.",
                        "The officer ordered them to leave.",
                        "She asked me to help her."
                    ]
                }
            ]
        },
        {
            group: "Verb + Gerund",
            items: [
                {
                    label: "Suggest / Admit / Deny",
                    formula: "verb + V-ing",
                    examples: [
                        "She suggested eating outside.",
                        "He admitted making a mistake.",
                        "They denied stealing the money."
                    ]
                }
            ]
        },
        {
            group: "Verb + That Clause",
            items: [
                {
                    label: "Say / Explain / Promise",
                    formula: "verb + that + clause",
                    examples: [
                        "He said that he was tired.",
                        "She explained that she had been busy.",
                        "They promised that they would come."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Object + To",
            question: "She advised me ___ harder.",
            options: ["study", "studying", "to study", "studied"],
            answer: "to study",
            explanation: "Advise memakai object + to + V1."
        },
        {
            type: "Object + To",
            question: "He warned us ___ the wire.",
            options: ["not touch", "not to touch", "to not touched", "touching"],
            answer: "not to touch",
            explanation: "Warn memakai object + not to + V1 untuk larangan."
        },
        {
            type: "Object + To",
            question: "The teacher told us ___ quiet.",
            options: ["be", "being", "to be", "been"],
            answer: "to be",
            explanation: "Tell memakai object + to + V1."
        },
        {
            type: "Object + To",
            question: "She asked me ___ her.",
            options: ["help", "helping", "to help", "helped"],
            answer: "to help",
            explanation: "Ask untuk permintaan memakai object + to + V1."
        },
        {
            type: "Gerund",
            question: "She suggested ___ outside.",
            options: ["eat", "eating", "to eat", "ate"],
            answer: "eating",
            explanation: "Suggest dapat diikuti gerund."
        },
        {
            type: "Gerund",
            question: "He admitted ___ a mistake.",
            options: ["make", "making", "to make", "made"],
            answer: "making",
            explanation: "Admit diikuti gerund."
        },
        {
            type: "Gerund",
            question: "They denied ___ the money.",
            options: ["steal", "stealing", "to steal", "stole"],
            answer: "stealing",
            explanation: "Deny diikuti gerund."
        },
        {
            type: "That Clause",
            question: "He said ___ he was tired.",
            options: ["that", "to", "for", "with"],
            answer: "that",
            explanation: "Say dapat diikuti that-clause."
        },
        {
            type: "Promise",
            question: "They promised ___ come.",
            options: ["that", "to", "for", "with"],
            answer: "to",
            explanation: "Promise dapat diikuti to + V1."
        },
        {
            type: "Said/Told",
            question: "Which sentence is correct?",
            options: [
                "She said me the truth.",
                "She told me the truth.",
                "She told the truth me.",
                "She said to me the truth me."
            ],
            answer: "She told me the truth.",
            explanation: "Told membutuhkan object dan dapat langsung diikuti informasi."
        }
    ]
},

"reported-speech-review": {
    title: "Reported Speech Review",
    description: "Review akhir untuk menguji pemahaman Direct Speech, Reported Statements, Questions, Commands, Backshift, dan Reporting Verbs.",

    formula: `
        <strong>Ringkasan BAB 8:</strong><br>
        Statements → said/told + that + clause<br>
        Questions → asked + if/whether / WH + clause<br>
        Commands → told/asked + object + to + V1<br>
        Backshift → tense mundur satu langkah
    `,

    notes: [
        "Gunakan said tanpa object.",
        "Gunakan told dengan object.",
        "Yes/No Question memakai if atau whether.",
        "WH Question mempertahankan kata tanya.",
        "Command memakai to + V1.",
        "Negative command memakai not to + V1.",
        "Reporting verb berbentuk past biasanya menyebabkan backshift."
    ],

    patterns: [
        {
            group: "Summary",
            items: [
                {
                    label: "Statements",
                    formula: "said/told + that + clause",
                    examples: [
                        "He said that he was tired.",
                        "She told me that she was busy."
                    ]
                },
                {
                    label: "Questions",
                    formula: "asked + if/WH + clause",
                    examples: [
                        "He asked if I was ready.",
                        "She asked where I lived."
                    ]
                },
                {
                    label: "Commands",
                    formula: "told/asked + object + to + V1",
                    examples: [
                        "He told me to sit down.",
                        "She asked me to help her."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type:"Statements",
            question:"Direct: He said, \"I am tired.\"",
            options:[
                "He said that he was tired.",
                "He said that he is tired.",
                "He told that he was tired.",
                "He asked if he was tired."
            ],
            answer:"He said that he was tired.",
            explanation:"Simple Present berubah menjadi Simple Past."
        },
        {
            type:"Statements",
            question:"Which sentence correctly uses 'told'?",
            options:[
                "She told me that she was happy.",
                "She told that she was happy.",
                "She told happy.",
                "She told."
            ],
            answer:"She told me that she was happy.",
            explanation:"Told harus diikuti object."
        },
        {
            type:"Questions",
            question:"He asked, \"Are you ready?\"",
            options:[
                "He asked if I was ready.",
                "He asked was I ready.",
                "He asked if was I ready.",
                "He asked am I ready."
            ],
            answer:"He asked if I was ready.",
            explanation:"Yes/No Question memakai if."
        },
        {
            type:"Questions",
            question:"She asked, \"Where do you live?\"",
            options:[
                "She asked where I lived.",
                "She asked where did I live.",
                "She asked where do I live.",
                "She asked lived I where."
            ],
            answer:"She asked where I lived.",
            explanation:"Urutan berubah menjadi statement."
        },
        {
            type:"Commands",
            question:"He said, \"Open the window.\"",
            options:[
                "He told me to open the window.",
                "He told me open the window.",
                "He asked if I opened the window.",
                "He said that open the window."
            ],
            answer:"He told me to open the window.",
            explanation:"Command memakai to + V1."
        },
        {
            type:"Commands",
            question:"She said, \"Don't be late.\"",
            options:[
                "She told him not to be late.",
                "She told him don't be late.",
                "She asked if he was late.",
                "She told him not be late."
            ],
            answer:"She told him not to be late.",
            explanation:"Negative command memakai not to."
        },
        {
            type:"Backshift",
            question:"Simple Present changes into...",
            options:[
                "Simple Past",
                "Future",
                "Past Perfect",
                "Present Perfect"
            ],
            answer:"Simple Past",
            explanation:"Backshift pertama."
        },
        {
            type:"Backshift",
            question:"Will changes into...",
            options:[
                "would",
                "could",
                "had",
                "has"
            ],
            answer:"would",
            explanation:"Will berubah menjadi would."
        },
        {
            type:"Backshift",
            question:"Can changes into...",
            options:[
                "could",
                "would",
                "might",
                "must"
            ],
            answer:"could",
            explanation:"Can berubah menjadi could."
        },
        {
            type:"Backshift",
            question:"Present Perfect changes into...",
            options:[
                "Past Perfect",
                "Simple Past",
                "Past Continuous",
                "Future Perfect"
            ],
            answer:"Past Perfect",
            explanation:"Have/has + V3 berubah menjadi had + V3."
        },
        {
            type:"Reporting Verb",
            question:"Which verb needs an object?",
            options:[
                "told",
                "said",
                "explained",
                "mentioned"
            ],
            answer:"told",
            explanation:"Told hampir selalu membutuhkan object."
        },
        {
            type:"Reporting Verb",
            question:"She advised me ___ harder.",
            options:[
                "to study",
                "study",
                "studying",
                "studied"
            ],
            answer:"to study",
            explanation:"Advise + object + to + V1."
        },
        {
            type:"Reporting Verb",
            question:"She suggested ___ outside.",
            options:[
                "eating",
                "eat",
                "to eat",
                "ate"
            ],
            answer:"eating",
            explanation:"Suggest dapat diikuti gerund."
        },
        {
            type:"Reporting Verb",
            question:"He admitted ___ the mistake.",
            options:[
                "making",
                "make",
                "to make",
                "made"
            ],
            answer:"making",
            explanation:"Admit diikuti gerund."
        },
        {
            type:"Concept",
            question:"Reported Speech is also called...",
            options:[
                "Indirect Speech",
                "Passive Voice",
                "Direct Object",
                "Nominal Sentence"
            ],
            answer:"Indirect Speech",
            explanation:"Nama lainnya adalah Indirect Speech."
        },
        {
            type:"Concept",
            question:"Which reported question uses correct word order?",
            options:[
                "She asked where he lived.",
                "She asked where did he live.",
                "She asked where he did live.",
                "She asked did he live where."
            ],
            answer:"She asked where he lived.",
            explanation:"Reported question menggunakan urutan statement."
        },
        {
            type:"Concept",
            question:"Negative commands use...",
            options:[
                "not to + V1",
                "don't + V1",
                "didn't + V1",
                "not + V2"
            ],
            answer:"not to + V1",
            explanation:"Ini adalah pola standar."
        },
        {
            type:"Concept",
            question:"The word 'that' in reported statements is...",
            options:[
                "often optional",
                "always required",
                "never used",
                "an article"
            ],
            answer:"often optional",
            explanation:"Dalam percakapan sehari-hari, 'that' sering dihilangkan."
        },
        {
            type:"Concept",
            question:"Backshift usually happens when reporting verb is...",
            options:[
                "past",
                "future",
                "present continuous",
                "modal"
            ],
            answer:"past",
            explanation:"Said, told, asked menyebabkan backshift."
        },
        {
            type:"Final",
            question:"Which sentence is completely correct?",
            options:[
                "He told me that he would come.",
                "He said me that he would come.",
                "He asked me that he would come.",
                "He told that he would come."
            ],
            answer:"He told me that he would come.",
            explanation:"Told membutuhkan object dan struktur kalimat sudah benar."
        }
    ]
},

"relative-clauses": {
    title: "Introduction to Relative Clauses",
    description: "Relative Clause adalah klausa yang digunakan untuk menjelaskan noun. Relative clause biasanya diawali dengan relative pronoun seperti who, whom, which, that, whose, where, atau when.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Noun + Relative Pronoun + Clause
    `,

    notes: [
        "Relative clause digunakan untuk memberi informasi tambahan tentang noun.",
        "Who digunakan untuk orang sebagai subject.",
        "Whom digunakan untuk orang sebagai object.",
        "Which digunakan untuk benda atau hewan.",
        "That dapat digunakan untuk orang, benda, atau hewan dalam defining clause.",
        "Whose menunjukkan kepemilikan.",
        "Where digunakan untuk tempat.",
        "When digunakan untuk waktu."
    ],

    patterns: [
        {
            group: "Basic Function",
            items: [
                {
                    label: "Describe People",
                    formula: "person + who/that + clause",
                    examples: [
                        "The man who lives next door is friendly.",
                        "The student who won the competition is my friend.",
                        "The teacher that teaches English is kind."
                    ]
                },
                {
                    label: "Describe Things",
                    formula: "thing + which/that + clause",
                    examples: [
                        "The book which is on the table is mine.",
                        "The car that he bought is expensive.",
                        "The phone which I use is new."
                    ]
                },
                {
                    label: "Describe Place / Time",
                    formula: "place/time + where/when + clause",
                    examples: [
                        "This is the school where I studied.",
                        "Monday is the day when we have English class.",
                        "Jakarta is the city where she was born."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Relative clause is used to describe...",
            options: ["noun", "verb only", "adverb only", "article"],
            answer: "noun",
            explanation: "Relative clause memberi informasi tambahan tentang noun."
        },
        {
            type: "People",
            question: "The man ___ lives next door is friendly.",
            options: ["who", "which", "where", "when"],
            answer: "who",
            explanation: "Who digunakan untuk orang sebagai subject."
        },
        {
            type: "Things",
            question: "The book ___ is on the table is mine.",
            options: ["who", "which", "where", "when"],
            answer: "which",
            explanation: "Which digunakan untuk benda."
        },
        {
            type: "Place",
            question: "This is the school ___ I studied.",
            options: ["who", "which", "where", "when"],
            answer: "where",
            explanation: "Where digunakan untuk tempat."
        },
        {
            type: "Time",
            question: "Monday is the day ___ we have English class.",
            options: ["who", "which", "where", "when"],
            answer: "when",
            explanation: "When digunakan untuk waktu."
        },
        {
            type: "Possession",
            question: "The girl ___ bag was stolen is crying.",
            options: ["who", "whose", "which", "where"],
            answer: "whose",
            explanation: "Whose menunjukkan kepemilikan."
        },
        {
            type: "That",
            question: "The car ___ he bought is expensive.",
            options: ["that", "where", "when", "whose"],
            answer: "that",
            explanation: "That dapat digunakan untuk benda dalam defining clause."
        },
        {
            type: "Concept",
            question: "Which relative pronoun is used for possession?",
            options: ["whose", "where", "when", "which"],
            answer: "whose",
            explanation: "Whose digunakan untuk menunjukkan kepemilikan."
        },
        {
            type: "Concept",
            question: "Which relative pronoun is used for place?",
            options: ["where", "when", "who", "whose"],
            answer: "where",
            explanation: "Where digunakan untuk tempat."
        },
        {
            type: "Concept",
            question: "Which relative pronoun is used for time?",
            options: ["when", "where", "who", "which"],
            answer: "when",
            explanation: "When digunakan untuk waktu."
        }
    ]
},

"who-whom": {
    title: "Who & Whom",
    description: "Who dan whom digunakan dalam relative clause untuk menjelaskan orang. Who digunakan ketika orang tersebut berfungsi sebagai subject, sedangkan whom digunakan ketika orang tersebut berfungsi sebagai object.",

    formula: `
        <strong>Inti Materi:</strong><br>
        who = subject untuk orang<br>
        whom = object untuk orang
    `,

    notes: [
        "Who digunakan untuk orang sebagai subject.",
        "Whom digunakan untuk orang sebagai object.",
        "Dalam percakapan modern, whom sering diganti dengan who.",
        "Whom lebih formal dan sering muncul dalam tulisan akademik.",
        "Gunakan whom setelah preposition seperti to whom, with whom, for whom."
    ],

    patterns: [
        {
            group: "Who",
            items: [
                {
                    label: "Subject",
                    formula: "person + who + verb",
                    examples: [
                        "The man who lives next door is kind.",
                        "The student who won the prize is my friend.",
                        "The woman who teaches English is patient."
                    ]
                }
            ]
        },
        {
            group: "Whom",
            items: [
                {
                    label: "Object",
                    formula: "person + whom + subject + verb",
                    examples: [
                        "The man whom I met yesterday is a doctor.",
                        "The girl whom he helped was grateful.",
                        "The teacher whom we respect is retiring."
                    ]
                },
                {
                    label: "After Preposition",
                    formula: "preposition + whom",
                    examples: [
                        "The person to whom I spoke was polite.",
                        "The friend with whom I traveled was funny.",
                        "The student for whom I bought the book was absent."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Who",
            question: "The woman ___ teaches English is kind.",
            options: ["who", "whom", "where", "when"],
            answer: "who",
            explanation: "Who digunakan karena woman menjadi subject dari teaches."
        },
        {
            type: "Who",
            question: "The student ___ won the prize is my friend.",
            options: ["who", "whom", "whose", "where"],
            answer: "who",
            explanation: "Who digunakan untuk orang sebagai subject."
        },
        {
            type: "Whom",
            question: "The man ___ I met yesterday is a doctor.",
            options: ["who", "whom", "where", "when"],
            answer: "whom",
            explanation: "Whom digunakan karena man menjadi object dari met."
        },
        {
            type: "Whom",
            question: "The teacher ___ we respect is retiring.",
            options: ["whom", "where", "when", "whose"],
            answer: "whom",
            explanation: "Whom digunakan untuk orang sebagai object."
        },
        {
            type: "Preposition",
            question: "The person to ___ I spoke was polite.",
            options: ["who", "whom", "which", "where"],
            answer: "whom",
            explanation: "Setelah preposition to, gunakan whom."
        },
        {
            type: "Concept",
            question: "Who is used when the person is...",
            options: ["subject", "object only", "place", "time"],
            answer: "subject",
            explanation: "Who digunakan untuk orang sebagai subject."
        },
        {
            type: "Concept",
            question: "Whom is used when the person is...",
            options: ["object", "place", "time", "possession"],
            answer: "object",
            explanation: "Whom digunakan untuk orang sebagai object."
        },
        {
            type: "Formal",
            question: "Which phrase is more formal?",
            options: ["to whom", "to who", "where whom", "when whom"],
            answer: "to whom",
            explanation: "Whom digunakan setelah preposition dalam gaya formal."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The man who lives next door is kind.",
                "The man whom lives next door is kind.",
                "The man where lives next door is kind.",
                "The man when lives next door is kind."
            ],
            answer: "The man who lives next door is kind.",
            explanation: "Who digunakan sebagai subject dari lives."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct in formal English?",
            options: [
                "The person to whom I spoke was polite.",
                "The person to who I spoke was polite.",
                "The person where I spoke was polite.",
                "The person when I spoke was polite."
            ],
            answer: "The person to whom I spoke was polite.",
            explanation: "Setelah preposition to, bentuk formalnya adalah whom."
        }
    ]
},

"which-that": {
    title: "Which & That",
    description: "Which dan that digunakan untuk menggantikan benda atau hewan dalam relative clause. Which dapat digunakan pada defining maupun non-defining clause, sedangkan that hanya digunakan pada defining clause.",

    formula: `
        <strong>Inti Materi:</strong><br>
        thing + which + clause<br>
        thing + that + clause
    `,

    notes: [
        "Which digunakan untuk benda atau hewan.",
        "That juga dapat digunakan untuk benda atau hewan.",
        "That tidak digunakan setelah koma (non-defining clause).",
        "Which lebih umum dalam penulisan formal.",
        "Dalam defining clause, which dan that sering dapat saling menggantikan."
    ],

    patterns: [
        {
            group: "Which",
            items: [
                {
                    label: "Things",
                    formula: "thing + which + clause",
                    examples: [
                        "The book which is on the table is mine.",
                        "The car which I bought is expensive.",
                        "The phone which she uses is new."
                    ]
                },
                {
                    label: "Non-Defining",
                    formula: "noun, which + clause",
                    examples: [
                        "My car, which is ten years old, still runs well.",
                        "The Eiffel Tower, which is in Paris, attracts millions of visitors.",
                        "My laptop, which I bought last year, works perfectly."
                    ]
                }
            ]
        },
        {
            group: "That",
            items: [
                {
                    label: "Defining Clause",
                    formula: "thing + that + clause",
                    examples: [
                        "The book that is on the table is mine.",
                        "The house that Jack built is famous.",
                        "The computer that I use is fast."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Which",
            question: "The book ___ is on the table is mine.",
            options: ["which", "who", "where", "when"],
            answer: "which",
            explanation: "Which digunakan untuk benda."
        },
        {
            type: "That",
            question: "The computer ___ I use is very fast.",
            options: ["that", "who", "whose", "where"],
            answer: "that",
            explanation: "That dapat digunakan untuk benda dalam defining clause."
        },
        {
            type: "Object",
            question: "The car ___ he bought is expensive.",
            options: ["which", "where", "when", "whose"],
            answer: "which",
            explanation: "Which digunakan sebagai object untuk benda."
        },
        {
            type: "Concept",
            question: "Which relative pronoun can introduce a non-defining clause?",
            options: ["which", "that", "who only", "where"],
            answer: "which",
            explanation: "That tidak digunakan pada non-defining clause."
        },
        {
            type: "Concept",
            question: "That is commonly used in...",
            options: [
                "defining clauses",
                "non-defining clauses",
                "questions only",
                "commands only"
            ],
            answer: "defining clauses",
            explanation: "That hanya digunakan pada defining clause."
        },
        {
            type: "Comma",
            question: "Which sentence is correct?",
            options: [
                "My car, which is old, still works.",
                "My car, that is old, still works.",
                "My car that, is old still works.",
                "My car which is old still works."
            ],
            answer: "My car, which is old, still works.",
            explanation: "Non-defining clause memakai which dan dipisahkan dengan koma."
        },
        {
            type: "Defining",
            question: "Which sentence is correct?",
            options: [
                "The book that I borrowed is interesting.",
                "The book, that I borrowed, is interesting.",
                "The book where I borrowed is interesting.",
                "The book when I borrowed is interesting."
            ],
            answer: "The book that I borrowed is interesting.",
            explanation: "That digunakan dalam defining clause tanpa koma."
        },
        {
            type: "Concept",
            question: "Which and that are mainly used for...",
            options: [
                "things and animals",
                "people only",
                "places only",
                "time only"
            ],
            answer: "things and animals",
            explanation: "Which dan that digunakan untuk benda atau hewan."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The phone which she uses is new.",
                "The phone who she uses is new.",
                "The phone where she uses is new.",
                "The phone when she uses is new."
            ],
            answer: "The phone which she uses is new.",
            explanation: "Which digunakan untuk benda."
        },
        {
            type: "Comparison",
            question: "Which sentence uses a non-defining relative clause?",
            options: [
                "My house, which was built in 1990, is still beautiful.",
                "The house that Jack built is famous.",
                "The book that I borrowed is interesting.",
                "The computer that I use is fast."
            ],
            answer: "My house, which was built in 1990, is still beautiful.",
            explanation: "Adanya koma menunjukkan non-defining clause sehingga menggunakan which."
        }
    ]
},

"whose": {
    title: "Whose",
    description: "Whose digunakan dalam relative clause untuk menunjukkan kepemilikan. Whose dapat digunakan untuk orang maupun benda.",

    formula: `
        <strong>Inti Materi:</strong><br>
        person/thing + whose + noun + clause
    `,

    notes: [
        "Whose menunjukkan hubungan kepemilikan.",
        "Whose dapat digunakan untuk orang.",
        "Whose juga dapat digunakan untuk benda atau hewan.",
        "Setelah whose selalu diikuti noun.",
        "Whose tidak sama dengan who's. Who's adalah singkatan dari who is atau who has."
    ],

    patterns: [
        {
            group: "People",
            items: [
                {
                    label: "Person",
                    formula: "person + whose + noun + clause",
                    examples: [
                        "The girl whose bag was stolen is crying.",
                        "The teacher whose class I joined is friendly.",
                        "The man whose son is a doctor lives next door."
                    ]
                }
            ]
        },
        {
            group: "Things",
            items: [
                {
                    label: "Thing",
                    formula: "thing + whose + noun + clause",
                    examples: [
                        "The company whose products are popular is expanding.",
                        "The house whose roof was damaged has been repaired.",
                        "The car whose engine failed was towed away."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "People",
            question: "The girl ___ bag was stolen is crying.",
            options: ["who", "whose", "whom", "which"],
            answer: "whose",
            explanation: "Whose menunjukkan kepemilikan terhadap bag."
        },
        {
            type: "People",
            question: "The teacher ___ class I joined is very kind.",
            options: ["whose", "who", "which", "where"],
            answer: "whose",
            explanation: "Class dimiliki oleh teacher."
        },
        {
            type: "People",
            question: "The man ___ son is a doctor lives here.",
            options: ["whose", "who", "whom", "that"],
            answer: "whose",
            explanation: "Son dimiliki oleh the man."
        },
        {
            type: "Things",
            question: "The company ___ products are famous is expanding.",
            options: ["whose", "which", "that", "where"],
            answer: "whose",
            explanation: "Products dimiliki oleh company."
        },
        {
            type: "Things",
            question: "The house ___ roof was damaged has been repaired.",
            options: ["whose", "where", "which", "who"],
            answer: "whose",
            explanation: "Roof merupakan bagian dari house."
        },
        {
            type: "Concept",
            question: "Whose shows...",
            options: [
                "possession",
                "location",
                "time",
                "question"
            ],
            answer: "possession",
            explanation: "Whose digunakan untuk menunjukkan kepemilikan."
        },
        {
            type: "Grammar",
            question: "After 'whose' we usually use...",
            options: [
                "a noun",
                "a verb",
                "an adjective",
                "an adverb"
            ],
            answer: "a noun",
            explanation: "Whose selalu diikuti noun, misalnya whose car, whose house."
        },
        {
            type: "Difference",
            question: "Which sentence is correct?",
            options: [
                "The girl whose phone is ringing is my sister.",
                "The girl who's phone is ringing is my sister.",
                "The girl who phone is ringing is my sister.",
                "The girl whom phone is ringing is my sister."
            ],
            answer: "The girl whose phone is ringing is my sister.",
            explanation: "Whose adalah relative pronoun, sedangkan who's berarti who is/who has."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The car whose engine failed was repaired.",
                "The car which engine failed was repaired.",
                "The car who engine failed was repaired.",
                "The car where engine failed was repaired."
            ],
            answer: "The car whose engine failed was repaired.",
            explanation: "Whose dapat digunakan untuk menunjukkan kepemilikan pada benda."
        },
        {
            type: "Concept",
            question: "Whose can be used for...",
            options: [
                "people and things",
                "people only",
                "things only",
                "places only"
            ],
            answer: "people and things",
            explanation: "Dalam grammar modern, whose dapat digunakan baik untuk orang maupun benda."
        }
    ]
}, 

"where-when": {
    title: "Where & When",
    description: "Where dan when digunakan dalam relative clause untuk menjelaskan tempat dan waktu. Where menggantikan place (tempat), sedangkan when menggantikan time (waktu).",

    formula: `
        <strong>Inti Materi:</strong><br>
        Place + where + clause<br>
        Time + when + clause
    `,

    notes: [
        "Where digunakan untuk menjelaskan tempat.",
        "When digunakan untuk menjelaskan waktu.",
        "Where dapat diganti dengan in which pada bahasa formal.",
        "When dapat diganti dengan on/in/at which pada bahasa formal.",
        "Jika menggunakan where atau when, jangan tambahkan preposition lagi.",
        "Gunakan which jika preposition tetap ingin ditulis."
    ],

    patterns: [
        {
            group: "Where",
            items: [
                {
                    label: "Place",
                    formula: "place + where + clause",
                    examples: [
                        "This is the school where I studied.",
                        "The hotel where we stayed was beautiful.",
                        "Jakarta is the city where she was born."
                    ]
                },
                {
                    label: "Formal",
                    formula: "place + in which + clause",
                    examples: [
                        "This is the school in which I studied.",
                        "The hotel in which we stayed was beautiful.",
                        "The city in which she was born is Jakarta."
                    ]
                }
            ]
        },
        {
            group: "When",
            items: [
                {
                    label: "Time",
                    formula: "time + when + clause",
                    examples: [
                        "Sunday is the day when we rest.",
                        "2020 was the year when I graduated.",
                        "That was the moment when everything changed."
                    ]
                },
                {
                    label: "Formal",
                    formula: "time + on/in/at which + clause",
                    examples: [
                        "Sunday is the day on which we rest.",
                        "2020 was the year in which I graduated.",
                        "That was the moment at which everything changed."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Where",
            question: "This is the school ___ I studied.",
            options: ["where", "when", "whose", "who"],
            answer: "where",
            explanation: "Where digunakan untuk tempat."
        },
        {
            type: "Where",
            question: "The hotel ___ we stayed was comfortable.",
            options: ["where", "when", "who", "whose"],
            answer: "where",
            explanation: "Hotel adalah tempat."
        },
        {
            type: "Where",
            question: "Jakarta is the city ___ she was born.",
            options: ["where", "when", "which", "who"],
            answer: "where",
            explanation: "City adalah tempat."
        },
        {
            type: "When",
            question: "Sunday is the day ___ we usually relax.",
            options: ["where", "when", "whose", "who"],
            answer: "when",
            explanation: "Day menunjukkan waktu."
        },
        {
            type: "When",
            question: "2020 was the year ___ I graduated.",
            options: ["where", "when", "who", "whose"],
            answer: "when",
            explanation: "Year menunjukkan waktu."
        },
        {
            type: "Formal",
            question: "The school ___ I studied is very old. (formal)",
            options: [
                "in which",
                "at when",
                "who",
                "whose"
            ],
            answer: "in which",
            explanation: "Where dapat diganti dengan in which."
        },
        {
            type: "Formal",
            question: "Sunday is the day ___ we rest. (formal)",
            options: [
                "on which",
                "in where",
                "whose",
                "who"
            ],
            answer: "on which",
            explanation: "When dapat diganti dengan on which."
        },
        {
            type: "Concept",
            question: "Where is used for...",
            options: [
                "places",
                "time",
                "people",
                "possession"
            ],
            answer: "places",
            explanation: "Where digunakan untuk tempat."
        },
        {
            type: "Concept",
            question: "When is used for...",
            options: [
                "time",
                "people",
                "things",
                "places"
            ],
            answer: "time",
            explanation: "When digunakan untuk waktu."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "This is the school where I studied.",
                "This is the school where in I studied.",
                "This is the school when I studied.",
                "This is the school who I studied."
            ],
            answer: "This is the school where I studied.",
            explanation: "Jangan menggunakan preposition tambahan setelah where."
        }
    ]
}, 

"defining-nondefining": {
    title: "Defining vs Non-Defining Relative Clauses",
    description: "Relative clause dibagi menjadi dua jenis, yaitu Defining dan Non-Defining. Defining memberikan informasi yang penting untuk mengidentifikasi noun, sedangkan Non-Defining hanya memberikan informasi tambahan dan dipisahkan dengan koma.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Defining: Noun + Relative Clause<br>
        Non-Defining: Noun, Relative Clause,
    `,

    notes: [
        "Defining Clause memberikan informasi penting.",
        "Tanpa defining clause, arti kalimat bisa berubah atau menjadi tidak jelas.",
        "Non-defining clause hanya memberikan informasi tambahan.",
        "Non-defining clause selalu dipisahkan dengan koma.",
        "That tidak digunakan pada non-defining clause.",
        "Who dan which dapat digunakan pada non-defining clause."
    ],

    patterns: [
        {
            group: "Defining Clause",
            items: [
                {
                    label: "Essential Information",
                    formula: "noun + who/which/that + clause",
                    examples: [
                        "The student who won the competition is my brother.",
                        "The book that I borrowed is interesting.",
                        "The house which Jack built is famous."
                    ]
                }
            ]
        },
        {
            group: "Non-Defining Clause",
            items: [
                {
                    label: "Extra Information",
                    formula: "noun, who/which + clause,",
                    examples: [
                        "My brother, who lives in London, is a doctor.",
                        "My car, which is ten years old, still runs well.",
                        "Mr. Smith, who teaches English, is very friendly."
                    ]
                }
            ]
        },
        {
            group: "Meaning Difference",
            items: [
                {
                    label: "Compare",
                    formula: "Defining vs Non-Defining",
                    examples: [
                        "The students who studied passed the exam. (Only those students)",
                        "The students, who studied, passed the exam. (All students)"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Defining",
            question: "Which sentence contains a defining clause?",
            options: [
                "The book that I borrowed is interesting.",
                "My book, which I bought yesterday, is expensive.",
                "My father, who is a doctor, lives in Bandung.",
                "Jakarta, which is the capital of Indonesia, is crowded."
            ],
            answer: "The book that I borrowed is interesting.",
            explanation: "Defining clause tidak memakai koma dan menentukan noun."
        },
        {
            type: "Non-Defining",
            question: "Which sentence contains a non-defining clause?",
            options: [
                "My brother, who lives in London, is a doctor.",
                "The student who won the prize is happy.",
                "The car that I bought is new.",
                "The teacher who teaches math is absent."
            ],
            answer: "My brother, who lives in London, is a doctor.",
            explanation: "Non-defining clause dipisahkan dengan koma."
        },
        {
            type: "Comma",
            question: "Non-defining clauses are separated by...",
            options: [
                "commas",
                "quotation marks",
                "semicolon only",
                "colon"
            ],
            answer: "commas",
            explanation: "Non-defining clause selalu dipisahkan dengan koma."
        },
        {
            type: "That",
            question: "Which relative pronoun should NOT be used in non-defining clauses?",
            options: [
                "that",
                "which",
                "who",
                "whose"
            ],
            answer: "that",
            explanation: "That tidak digunakan pada non-defining clause."
        },
        {
            type: "Meaning",
            question: "Which clause gives essential information?",
            options: [
                "Defining Clause",
                "Non-Defining Clause",
                "Passive Voice",
                "Conditional Clause"
            ],
            answer: "Defining Clause",
            explanation: "Defining clause menentukan noun yang dimaksud."
        },
        {
            type: "Meaning",
            question: "Which clause gives extra information only?",
            options: [
                "Non-Defining Clause",
                "Defining Clause",
                "Reported Speech",
                "Modal Clause"
            ],
            answer: "Non-Defining Clause",
            explanation: "Non-defining hanya memberikan informasi tambahan."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "My car, which is old, still works.",
                "My car, that is old, still works.",
                "My car that, is old still works.",
                "My car where is old still works."
            ],
            answer: "My car, which is old, still works.",
            explanation: "Non-defining clause menggunakan which, bukan that."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "The teacher who teaches English is kind.",
                "The teacher, that teaches English, is kind.",
                "The teacher when teaches English is kind.",
                "The teacher where teaches English is kind."
            ],
            answer: "The teacher who teaches English is kind.",
            explanation: "Defining clause dapat menggunakan who tanpa koma."
        },
        {
            type: "Concept",
            question: "Removing a defining clause usually...",
            options: [
                "changes the meaning",
                "has no effect",
                "changes it into passive voice",
                "changes tense only"
            ],
            answer: "changes the meaning",
            explanation: "Defining clause penting untuk mengidentifikasi noun."
        },
        {
            type: "Concept",
            question: "Removing a non-defining clause usually...",
            options: [
                "keeps the main meaning",
                "makes the sentence impossible",
                "changes active to passive",
                "changes the subject"
            ],
            answer: "keeps the main meaning",
            explanation: "Non-defining clause hanya informasi tambahan."
        }
    ]
},

"relative-clauses-review": {
    title: "Relative Clauses Review",
    description: "Review akhir untuk menguji seluruh materi Relative Clauses.",

    formula: `
        <strong>Ringkasan BAB 9:</strong><br>
        who → people (subject)<br>
        whom → people (object)<br>
        which → things/animals<br>
        that → people/things (defining only)<br>
        whose → possession<br>
        where → place<br>
        when → time
    `,

    notes: [
        "Who digunakan untuk subject orang.",
        "Whom digunakan untuk object orang.",
        "Which digunakan untuk benda.",
        "That hanya digunakan pada defining clause.",
        "Whose menunjukkan kepemilikan.",
        "Where digunakan untuk tempat.",
        "When digunakan untuk waktu.",
        "Non-defining clause selalu memakai koma."
    ],

    patterns: [
        {
            group: "Summary",
            items: [
                {
                    label: "Relative Pronouns",
                    formula: "Noun + Relative Pronoun + Clause",
                    examples: [
                        "The man who helped me is kind.",
                        "The book which I bought is interesting.",
                        "The girl whose phone was stolen is crying."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type:"Who",
            question:"The man ___ lives next door is friendly.",
            options:["who","whom","which","where"],
            answer:"who",
            explanation:"Who digunakan sebagai subject."
        },
        {
            type:"Whom",
            question:"The teacher ___ we respect is retiring.",
            options:["whom","who","where","whose"],
            answer:"whom",
            explanation:"Whom digunakan sebagai object."
        },
        {
            type:"Which",
            question:"The book ___ I borrowed is interesting.",
            options:["which","who","whose","where"],
            answer:"which",
            explanation:"Which digunakan untuk benda."
        },
        {
            type:"That",
            question:"The car ___ he bought is expensive.",
            options:["that","where","when","whose"],
            answer:"that",
            explanation:"That digunakan pada defining clause."
        },
        {
            type:"Whose",
            question:"The girl ___ bag was stolen is crying.",
            options:["whose","who","whom","which"],
            answer:"whose",
            explanation:"Whose menunjukkan kepemilikan."
        },
        {
            type:"Where",
            question:"This is the city ___ I was born.",
            options:["where","when","who","whose"],
            answer:"where",
            explanation:"Where digunakan untuk tempat."
        },
        {
            type:"When",
            question:"Sunday is the day ___ we rest.",
            options:["when","where","whose","which"],
            answer:"when",
            explanation:"When digunakan untuk waktu."
        },
        {
            type:"Defining",
            question:"Which sentence contains a defining clause?",
            options:[
                "The book that I borrowed is interesting.",
                "My car, which is old, still works.",
                "My father, who is a doctor, lives in Bandung.",
                "Jakarta, which is the capital, is crowded."
            ],
            answer:"The book that I borrowed is interesting.",
            explanation:"Tidak memakai koma."
        },
        {
            type:"Non-Defining",
            question:"Which sentence contains a non-defining clause?",
            options:[
                "My brother, who lives in London, is a doctor.",
                "The student who won is happy.",
                "The book that I borrowed is interesting.",
                "The teacher who teaches math is absent."
            ],
            answer:"My brother, who lives in London, is a doctor.",
            explanation:"Dipisahkan dengan koma."
        },
        {
            type:"Concept",
            question:"Which pronoun shows possession?",
            options:["whose","who","which","where"],
            answer:"whose",
            explanation:"Whose menunjukkan kepemilikan."
        },
        {
            type:"Concept",
            question:"Which pronoun is NOT used in non-defining clauses?",
            options:["that","which","who","whose"],
            answer:"that",
            explanation:"That hanya digunakan pada defining clause."
        },
        {
            type:"Concept",
            question:"Who is used for...",
            options:[
                "people as subject",
                "people as object",
                "things",
                "places"
            ],
            answer:"people as subject",
            explanation:"Who adalah subject."
        },
        {
            type:"Concept",
            question:"Whom is used for...",
            options:[
                "people as object",
                "people as subject",
                "things",
                "time"
            ],
            answer:"people as object",
            explanation:"Whom adalah object."
        },
        {
            type:"Concept",
            question:"Which is mainly used for...",
            options:[
                "things",
                "people",
                "time",
                "places"
            ],
            answer:"things",
            explanation:"Which digunakan untuk benda."
        },
        {
            type:"Grammar",
            question:"Which sentence is correct?",
            options:[
                "The person to whom I spoke was helpful.",
                "The person to who I spoke was helpful.",
                "The person where I spoke was helpful.",
                "The person when I spoke was helpful."
            ],
            answer:"The person to whom I spoke was helpful.",
            explanation:"Setelah preposition gunakan whom."
        },
        {
            type:"Grammar",
            question:"Which sentence is correct?",
            options:[
                "The company whose products are famous is expanding.",
                "The company which products are famous is expanding.",
                "The company who products are famous is expanding.",
                "The company where products are famous is expanding."
            ],
            answer:"The company whose products are famous is expanding.",
            explanation:"Whose dapat digunakan untuk benda."
        },
        {
            type:"Grammar",
            question:"Which sentence is correct?",
            options:[
                "The hotel where we stayed was comfortable.",
                "The hotel when we stayed was comfortable.",
                "The hotel whose we stayed was comfortable.",
                "The hotel who we stayed was comfortable."
            ],
            answer:"The hotel where we stayed was comfortable.",
            explanation:"Hotel adalah tempat."
        },
        {
            type:"Grammar",
            question:"Which sentence is correct?",
            options:[
                "2020 was the year when I graduated.",
                "2020 was the year where I graduated.",
                "2020 was the year who I graduated.",
                "2020 was the year whose I graduated."
            ],
            answer:"2020 was the year when I graduated.",
            explanation:"Year menunjukkan waktu."
        },
        {
            type:"Meaning",
            question:"Removing a defining clause usually...",
            options:[
                "changes the meaning",
                "has no effect",
                "changes tense",
                "changes voice"
            ],
            answer:"changes the meaning",
            explanation:"Defining clause penting untuk identifikasi."
        },
        {
            type:"Meaning",
            question:"Removing a non-defining clause usually...",
            options:[
                "keeps the main meaning",
                "makes the sentence incorrect",
                "changes passive voice",
                "changes subject"
            ],
            answer:"keeps the main meaning",
            explanation:"Non-defining clause hanya informasi tambahan."
        }
    ]
},

"noun-clauses": {
    title: "Introduction to Noun Clauses",
    description: "Noun Clause adalah sebuah clause (subject + verb) yang berfungsi sebagai noun. Noun Clause dapat menjadi subject, object, atau complement dalam sebuah kalimat.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Noun Clause = Connector + Subject + Verb
    `,

    notes: [
        "Noun Clause selalu memiliki subject dan verb.",
        "Noun Clause berfungsi seperti noun.",
        "Noun Clause dapat menjadi subject.",
        "Noun Clause dapat menjadi object.",
        "Noun Clause dapat menjadi subject complement.",
        "Connector yang umum adalah that, whether, if, what, who, whom, whose, which, where, when, why, dan how."
    ],

    patterns: [
        {
            group: "As Subject",
            items: [
                {
                    label: "Subject",
                    formula: "Noun Clause + Verb",
                    examples: [
                        "What he said surprised everyone.",
                        "Where she lives is unknown.",
                        "Why he left remains a mystery."
                    ]
                }
            ]
        },
        {
            group: "As Object",
            items: [
                {
                    label: "Object",
                    formula: "Verb + Noun Clause",
                    examples: [
                        "I know what he wants.",
                        "She believes that he is honest.",
                        "They don't know where she went."
                    ]
                }
            ]
        },
        {
            group: "As Complement",
            items: [
                {
                    label: "Subject Complement",
                    formula: "Subject + be + Noun Clause",
                    examples: [
                        "The problem is that we are late.",
                        "The question is whether he will come.",
                        "The fact is that nobody knows."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A noun clause functions as...",
            options: [
                "a noun",
                "an adjective",
                "an adverb",
                "a preposition"
            ],
            answer: "a noun",
            explanation: "Noun Clause berfungsi seperti noun."
        },
        {
            type: "Concept",
            question: "A noun clause always contains...",
            options: [
                "a subject and a verb",
                "an adjective only",
                "a preposition only",
                "an article"
            ],
            answer: "a subject and a verb",
            explanation: "Clause harus memiliki subject dan verb."
        },
        {
            type: "Subject",
            question: "___ surprised everyone.",
            options: [
                "What he said",
                "What said",
                "He said",
                "What saying"
            ],
            answer: "What he said",
            explanation: "Noun clause dapat menjadi subject."
        },
        {
            type: "Object",
            question: "I know ___",
            options: [
                "what he wants",
                "what wants he",
                "he wants what",
                "what wanting"
            ],
            answer: "what he wants",
            explanation: "Urutan noun clause adalah connector + subject + verb."
        },
        {
            type: "Complement",
            question: "The problem is ___",
            options: [
                "that we are late",
                "that are we late",
                "we are that late",
                "late that we are"
            ],
            answer: "that we are late",
            explanation: "Noun clause dapat menjadi complement."
        },
        {
            type: "Connector",
            question: "Which word can introduce a noun clause?",
            options: [
                "that",
                "because only",
                "although only",
                "despite"
            ],
            answer: "that",
            explanation: "That merupakan connector noun clause yang paling umum."
        },
        {
            type: "Grammar",
            question: "Which sentence contains a noun clause?",
            options: [
                "I know where he lives.",
                "The man who lives there is kind.",
                "The book on the table is mine.",
                "She quickly finished."
            ],
            answer: "I know where he lives.",
            explanation: "'Where he lives' berfungsi sebagai object."
        },
        {
            type: "Concept",
            question: "A noun clause can be used as...",
            options: [
                "subject, object, or complement",
                "verb only",
                "adjective only",
                "adverb only"
            ],
            answer: "subject, object, or complement",
            explanation: "Itulah tiga fungsi utama noun clause."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "What she said made me happy.",
                "What said she made me happy.",
                "She what said made me happy.",
                "What saying she made me happy."
            ],
            answer: "What she said made me happy.",
            explanation: "Connector + subject + verb."
        },
        {
            type: "Concept",
            question: "Relative clauses describe nouns, while noun clauses...",
            options: [
                "act as nouns",
                "describe verbs",
                "modify adjectives",
                "show time"
            ],
            answer: "act as nouns",
            explanation: "Ini perbedaan utama antara Relative Clause dan Noun Clause."
        }
    ]
},

"that-clauses": {
    title: "That Clauses",
    description: "That Clause adalah jenis noun clause yang diawali dengan 'that'. Clause ini digunakan untuk melaporkan fakta, pendapat, keyakinan, atau informasi. Dalam percakapan sehari-hari, kata 'that' sering dihilangkan setelah beberapa reporting verbs.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + (that) + Subject + Verb
    `,

    notes: [
        "That Clause berfungsi sebagai noun.",
        "Paling sering menjadi object setelah reporting verbs.",
        "Kata 'that' sering boleh dihilangkan dalam percakapan.",
        "That tidak memiliki arti khusus, hanya sebagai connector.",
        "Verb yang sering diikuti that clause antara lain: think, know, believe, say, hope, hear, realize, explain, admit."
    ],

    patterns: [
        {
            group: "Object of Verb",
            items: [
                {
                    label: "Verb + That Clause",
                    formula: "Verb + (that) + Subject + Verb",
                    examples: [
                        "I think that she is honest.",
                        "She believes that he is innocent.",
                        "They know that the test is difficult."
                    ]
                },
                {
                    label: "Without That",
                    formula: "Verb + Subject + Verb",
                    examples: [
                        "I think she is honest.",
                        "We know he is busy.",
                        "She said she would come."
                    ]
                }
            ]
        },
        {
            group: "Subject Complement",
            items: [
                {
                    label: "Be + That Clause",
                    formula: "Subject + be + that clause",
                    examples: [
                        "The fact is that he lied.",
                        "The truth is that nobody knows.",
                        "The problem is that we are late."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A that clause usually functions as...",
            options: [
                "a noun clause",
                "an adjective",
                "an adverb",
                "a preposition"
            ],
            answer: "a noun clause",
            explanation: "That clause adalah salah satu jenis noun clause."
        },
        {
            type: "Grammar",
            question: "I think ___ she is right.",
            options: [
                "that",
                "who",
                "where",
                "whose"
            ],
            answer: "that",
            explanation: "That adalah connector yang paling umum."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "I think that she is right.",
                "I think that is she right.",
                "I think she that is right.",
                "I think right she is."
            ],
            answer: "I think that she is right.",
            explanation: "Urutan: connector + subject + verb."
        },
        {
            type: "Concept",
            question: "In everyday conversation, 'that' is often...",
            options: [
                "omitted",
                "replaced by who",
                "required twice",
                "changed to whose"
            ],
            answer: "omitted",
            explanation: "That sering dihilangkan setelah reporting verbs."
        },
        {
            type: "Grammar",
            question: "She believes ___ he is innocent.",
            options: [
                "that",
                "where",
                "whose",
                "when"
            ],
            answer: "that",
            explanation: "Believe biasanya diikuti that clause."
        },
        {
            type: "Grammar",
            question: "Which sentence sounds natural?",
            options: [
                "I know he is busy.",
                "I know who he is busy.",
                "I know where he is busy.",
                "I know whose he is busy."
            ],
            answer: "I know he is busy.",
            explanation: "That dapat dihilangkan."
        },
        {
            type: "Complement",
            question: "The truth is ___ nobody knows.",
            options: [
                "that",
                "where",
                "when",
                "who"
            ],
            answer: "that",
            explanation: "Be + that clause membentuk subject complement."
        },
        {
            type: "Concept",
            question: "Which verb commonly introduces a that clause?",
            options: [
                "believe",
                "run",
                "sleep",
                "jump"
            ],
            answer: "believe",
            explanation: "Believe sering diikuti that clause."
        },
        {
            type: "Grammar",
            question: "Which sentence contains a that clause?",
            options: [
                "She explained that the meeting was canceled.",
                "The man who helped me is kind.",
                "This is the school where I studied.",
                "If it rains, we will stay home."
            ],
            answer: "She explained that the meeting was canceled.",
            explanation: "That the meeting was canceled adalah noun clause."
        },
        {
            type: "Concept",
            question: "The word 'that' in a that clause mainly functions as...",
            options: [
                "a connector",
                "the subject",
                "the verb",
                "an adjective"
            ],
            answer: "a connector",
            explanation: "That hanya menghubungkan main clause dengan noun clause."
        }
    ]
},

"wh-clauses": {
    title: "WH Clauses",
    description: "WH Clause adalah noun clause yang diawali kata tanya seperti what, who, whom, whose, which, where, when, why, dan how. Dalam noun clause, urutan katanya harus berbentuk statement, bukan question.",

    formula: `
        <strong>Inti Materi:</strong><br>
        WH Word + Subject + Verb
    `,

    notes: [
        "WH Clause berfungsi sebagai noun.",
        "WH Clause dapat menjadi object setelah verb.",
        "Urutan kata dalam WH Clause adalah statement order.",
        "Jangan gunakan pola question seperti do you, did he, atau is she setelah WH word.",
        "What digunakan untuk benda/informasi.",
        "Where digunakan untuk tempat.",
        "When digunakan untuk waktu.",
        "Why digunakan untuk alasan.",
        "How digunakan untuk cara."
    ],

    patterns: [
        {
            group: "Object",
            items: [
                {
                    label: "WH Clause as Object",
                    formula: "Subject + Verb + WH word + Subject + Verb",
                    examples: [
                        "I know what he wants.",
                        "She understands why he left.",
                        "They don't know where she lives."
                    ]
                },
                {
                    label: "Statement Order",
                    formula: "WH + Subject + Verb",
                    examples: [
                        "Correct: I know where he lives.",
                        "Wrong: I know where does he live.",
                        "Correct: She asked what I wanted."
                    ]
                }
            ]
        },
        {
            group: "Common WH Words",
            items: [
                {
                    label: "What / Who / Whom",
                    formula: "WH word + subject + verb",
                    examples: [
                        "I know what she needs.",
                        "Do you know who called me?",
                        "I don't know whom they invited."
                    ]
                },
                {
                    label: "Where / When / Why / How",
                    formula: "WH word + subject + verb",
                    examples: [
                        "Tell me where you live.",
                        "I remember when we met.",
                        "She explained why she was late.",
                        "I don't know how he solved it."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "What",
            question: "I know ___ he wants.",
            options: ["what", "where", "when", "whose"],
            answer: "what",
            explanation: "What digunakan untuk benda atau informasi."
        },
        {
            type: "Where",
            question: "They don't know ___ she lives.",
            options: ["where", "when", "why", "whose"],
            answer: "where",
            explanation: "Where digunakan untuk tempat."
        },
        {
            type: "When",
            question: "I remember ___ we met.",
            options: ["when", "where", "whose", "whom"],
            answer: "when",
            explanation: "When digunakan untuk waktu."
        },
        {
            type: "Why",
            question: "She explained ___ she was late.",
            options: ["why", "where", "who", "whose"],
            answer: "why",
            explanation: "Why digunakan untuk alasan."
        },
        {
            type: "How",
            question: "I don't know ___ he solved it.",
            options: ["how", "what", "whose", "whom"],
            answer: "how",
            explanation: "How digunakan untuk cara."
        },
        {
            type: "Word Order",
            question: "Which sentence is correct?",
            options: [
                "I know where he lives.",
                "I know where does he live.",
                "I know where he does live.",
                "I know where lives he."
            ],
            answer: "I know where he lives.",
            explanation: "Noun clause memakai statement order: subject + verb."
        },
        {
            type: "Word Order",
            question: "Choose the correct noun clause.",
            options: [
                "what she wants",
                "what does she want",
                "what wants she",
                "what she does wants"
            ],
            answer: "what she wants",
            explanation: "Urutan benar adalah WH word + subject + verb."
        },
        {
            type: "Who",
            question: "Do you know ___ called me?",
            options: ["who", "whom", "where", "when"],
            answer: "who",
            explanation: "Who digunakan sebagai subject dari called."
        },
        {
            type: "Whom",
            question: "I don't know ___ they invited.",
            options: ["whom", "where", "when", "why"],
            answer: "whom",
            explanation: "Whom digunakan sebagai object dari invited."
        },
        {
            type: "Concept",
            question: "WH Clauses in noun clauses use...",
            options: [
                "statement word order",
                "question word order",
                "passive voice only",
                "article order"
            ],
            answer: "statement word order",
            explanation: "Noun clause tidak memakai susunan pertanyaan."
        }
    ]
},

"whether-if-clauses": {
    title: "Whether & If Clauses",
    description: "Whether Clause dan If Clause adalah noun clause yang digunakan untuk menyatakan dua kemungkinan (ya atau tidak). Keduanya sering digunakan setelah verb seperti know, ask, wonder, dan remember.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + whether/if + Subject + Verb
    `,

    notes: [
        "Whether dan if sama-sama berarti 'apakah'.",
        "Keduanya digunakan untuk pertanyaan Yes/No.",
        "Urutan kata tetap menggunakan statement order.",
        "Whether lebih formal daripada if.",
        "Setelah preposition gunakan whether, bukan if.",
        "Sebelum infinitive (to + V1), gunakan whether.",
        "Whether dapat digunakan sebelum 'or not'."
    ],

    patterns: [
        {
            group: "Basic Usage",
            items: [
                {
                    label: "If Clause",
                    formula: "Verb + if + Subject + Verb",
                    examples: [
                        "I don't know if he is coming.",
                        "She asked if I was busy.",
                        "We wonder if they will arrive."
                    ]
                },
                {
                    label: "Whether Clause",
                    formula: "Verb + whether + Subject + Verb",
                    examples: [
                        "I don't know whether he is coming.",
                        "She wondered whether I was busy.",
                        "We haven't decided whether we should go."
                    ]
                }
            ]
        },
        {
            group: "Special Usage",
            items: [
                {
                    label: "Whether + Or Not",
                    formula: "whether + clause + or not",
                    examples: [
                        "I don't know whether he will come or not.",
                        "She asked whether I agreed or not.",
                        "We must decide whether to stay or not."
                    ]
                },
                {
                    label: "Whether + To Infinitive",
                    formula: "whether + to + V1",
                    examples: [
                        "I don't know whether to laugh or cry.",
                        "She couldn't decide whether to stay.",
                        "They discussed whether to continue."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Whether and if are mainly used for...",
            options: [
                "Yes/No questions",
                "WH questions",
                "Relative clauses",
                "Passive voice"
            ],
            answer: "Yes/No questions",
            explanation: "Whether dan if digunakan untuk pertanyaan ya/tidak."
        },
        {
            type: "Grammar",
            question: "I don't know ___ he is coming.",
            options: [
                "whether",
                "who",
                "where",
                "whose"
            ],
            answer: "whether",
            explanation: "Whether dapat memperkenalkan noun clause."
        },
        {
            type: "Grammar",
            question: "She asked ___ I was busy.",
            options: [
                "if",
                "which",
                "when",
                "whose"
            ],
            answer: "if",
            explanation: "If dapat digunakan setelah ask."
        },
        {
            type: "Word Order",
            question: "Which sentence is correct?",
            options: [
                "I wonder if he is ready.",
                "I wonder if is he ready.",
                "I wonder if does he ready.",
                "I wonder if ready he is."
            ],
            answer: "I wonder if he is ready.",
            explanation: "Gunakan statement order."
        },
        {
            type: "Formal",
            question: "Which word is more formal?",
            options: [
                "whether",
                "if",
                "who",
                "that"
            ],
            answer: "whether",
            explanation: "Whether lebih formal daripada if."
        },
        {
            type: "Or Not",
            question: "Which sentence is correct?",
            options: [
                "I don't know whether he will come or not.",
                "I don't know if he will come or not always.",
                "I don't know whether will he come.",
                "I don't know if comes he."
            ],
            answer: "I don't know whether he will come or not.",
            explanation: "Whether sering dipakai bersama 'or not'."
        },
        {
            type: "Infinitive",
            question: "I can't decide ___ buy the blue shirt.",
            options: [
                "whether to",
                "if to",
                "whether",
                "if"
            ],
            answer: "whether to",
            explanation: "Gunakan whether sebelum to + V1."
        },
        {
            type: "Concept",
            question: "After a preposition, we usually use...",
            options: [
                "whether",
                "if",
                "that",
                "who"
            ],
            answer: "whether",
            explanation: "If tidak digunakan setelah preposition."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "We discussed whether to continue.",
                "We discussed if to continue.",
                "We discussed whether continue.",
                "We discussed if continue."
            ],
            answer: "We discussed whether to continue.",
            explanation: "Whether dapat diikuti to + V1."
        },
        {
            type: "Concept",
            question: "Whether clauses are classified as...",
            options: [
                "noun clauses",
                "relative clauses",
                "adverb clauses",
                "adjective clauses"
            ],
            answer: "noun clauses",
            explanation: "Whether clause merupakan salah satu jenis noun clause."
        }
    ]
}, 

"noun-clause-subject": {
    title: "Noun Clauses as Subject",
    description: "Noun Clause dapat berfungsi sebagai subject (subjek) dalam sebuah kalimat. Seluruh clause dianggap sebagai satu kesatuan yang menjadi pelaku atau topik utama kalimat.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Noun Clause + Main Verb
    `,

    notes: [
        "Noun clause dapat menjadi subject kalimat.",
        "Main verb mengikuti noun clause sebagai satu subject tunggal.",
        "Connector yang sering digunakan adalah what, who, where, when, why, how, whether, dan that.",
        "Noun clause sebagai subject sering muncul pada tulisan akademik.",
        "Jika noun clause panjang, kadang digunakan dummy subject 'it' agar kalimat lebih natural."
    ],

    patterns: [
        {
            group: "WH Clause as Subject",
            items: [
                {
                    label: "What",
                    formula: "What + Subject + Verb + Main Verb",
                    examples: [
                        "What he said surprised everyone.",
                        "What you did made me happy.",
                        "What she wants is impossible."
                    ]
                },
                {
                    label: "Where / Why",
                    formula: "Where/Why + Subject + Verb + Main Verb",
                    examples: [
                        "Where she lives is unknown.",
                        "Why he left remains a mystery.",
                        "How they escaped is unbelievable."
                    ]
                }
            ]
        },
        {
            group: "That / Whether Clause",
            items: [
                {
                    label: "That Clause",
                    formula: "That + Subject + Verb + Main Verb",
                    examples: [
                        "That he passed the exam surprised everyone.",
                        "That she resigned shocked the company.",
                        "That they arrived early helped us."
                    ]
                },
                {
                    label: "Whether Clause",
                    formula: "Whether + Subject + Verb + Main Verb",
                    examples: [
                        "Whether he comes is not important.",
                        "Whether we win depends on teamwork.",
                        "Whether she agrees remains uncertain."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Subject",
            question: "___ surprised everyone.",
            options: [
                "What he said",
                "What said he",
                "He said what",
                "What saying"
            ],
            answer: "What he said",
            explanation: "Noun clause berfungsi sebagai subject."
        },
        {
            type: "Subject",
            question: "___ is unknown.",
            options: [
                "Where she lives",
                "Where lives she",
                "She lives where",
                "Where living"
            ],
            answer: "Where she lives",
            explanation: "Where clause menjadi subject."
        },
        {
            type: "Subject",
            question: "___ remains a mystery.",
            options: [
                "Why he left",
                "Why left he",
                "He left why",
                "Why leaving"
            ],
            answer: "Why he left",
            explanation: "Why clause berfungsi sebagai subject."
        },
        {
            type: "That Clause",
            question: "___ surprised everyone.",
            options: [
                "That he passed the exam",
                "That passed he the exam",
                "He passed that exam",
                "That passing the exam"
            ],
            answer: "That he passed the exam",
            explanation: "That clause dapat menjadi subject."
        },
        {
            type: "Whether Clause",
            question: "___ is not important.",
            options: [
                "Whether he comes",
                "Whether comes he",
                "He comes whether",
                "Whether coming"
            ],
            answer: "Whether he comes",
            explanation: "Whether clause dapat menjadi subject."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "What she wants is expensive.",
                "What wants she is expensive.",
                "She wants what is expensive.",
                "What wanting she is expensive."
            ],
            answer: "What she wants is expensive.",
            explanation: "Gunakan statement order."
        },
        {
            type: "Concept",
            question: "A noun clause as subject is treated as...",
            options: [
                "one subject",
                "two subjects",
                "an adjective",
                "an adverb"
            ],
            answer: "one subject",
            explanation: "Seluruh noun clause dianggap satu subject."
        },
        {
            type: "Grammar",
            question: "Which sentence contains a noun clause as the subject?",
            options: [
                "How they escaped is unbelievable.",
                "I know how they escaped.",
                "She explained how they escaped.",
                "They escaped quickly."
            ],
            answer: "How they escaped is unbelievable.",
            explanation: "How they escaped adalah subject."
        },
        {
            type: "Concept",
            question: "Noun clauses as subjects are common in...",
            options: [
                "formal and academic writing",
                "imperative sentences only",
                "phrasal verbs",
                "articles"
            ],
            answer: "formal and academic writing",
            explanation: "Bentuk ini banyak ditemukan pada tulisan formal."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "Whether she agrees remains uncertain.",
                "Whether agrees she remains uncertain.",
                "She agrees whether remains uncertain.",
                "Whether agreeing she remains uncertain."
            ],
            answer: "Whether she agrees remains uncertain.",
            explanation: "Urutan noun clause adalah connector + subject + verb."
        }
    ]
}, 

"noun-clause-object": {
    title: "Noun Clauses as Object",
    description: "Noun Clause paling sering berfungsi sebagai object dari sebuah verb. Clause tersebut menerima aksi dari verb utama dan menjawab pertanyaan 'what?' atau 'what information?'.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subject + Verb + Noun Clause
    `,

    notes: [
        "Ini adalah penggunaan noun clause yang paling umum.",
        "Noun clause menjadi object setelah main verb.",
        "Verb yang sering diikuti noun clause antara lain know, think, believe, understand, explain, realize, remember, forget, wonder, ask, tell, say, hear, see, hope, decide.",
        "Connector dapat berupa that, whether, if, what, who, whom, whose, which, where, when, why, atau how.",
        "Urutan dalam noun clause tetap menggunakan statement order."
    ],

    patterns: [
        {
            group: "That Clause",
            items: [
                {
                    label: "Object",
                    formula: "Subject + Verb + that + Subject + Verb",
                    examples: [
                        "I know that she is honest.",
                        "She believes that he is innocent.",
                        "We hope that everything will be fine."
                    ]
                }
            ]
        },
        {
            group: "WH Clause",
            items: [
                {
                    label: "WH Object",
                    formula: "Subject + Verb + WH Clause",
                    examples: [
                        "I know what he wants.",
                        "She understands why he left.",
                        "They remember where we met."
                    ]
                }
            ]
        },
        {
            group: "Whether / If Clause",
            items: [
                {
                    label: "Yes / No Object",
                    formula: "Subject + Verb + whether/if + Subject + Verb",
                    examples: [
                        "I don't know whether he is coming.",
                        "She asked if I was busy.",
                        "We wonder whether they will agree."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A noun clause as an object comes after...",
            options: [
                "a verb",
                "an article",
                "an adjective only",
                "a preposition only"
            ],
            answer: "a verb",
            explanation: "Object menerima aksi dari verb utama."
        },
        {
            type: "That Clause",
            question: "I know ___ she is honest.",
            options: [
                "that",
                "who",
                "where",
                "when"
            ],
            answer: "that",
            explanation: "Know sering diikuti that clause."
        },
        {
            type: "WH Clause",
            question: "She knows ___ he lives.",
            options: [
                "where",
                "when",
                "whose",
                "that"
            ],
            answer: "where",
            explanation: "Where clause menjadi object dari knows."
        },
        {
            type: "WH Clause",
            question: "I remember ___ we met.",
            options: [
                "when",
                "whose",
                "which",
                "who"
            ],
            answer: "when",
            explanation: "When clause menjadi object dari remember."
        },
        {
            type: "Whether",
            question: "We don't know ___ they will come.",
            options: [
                "whether",
                "whose",
                "who",
                "what"
            ],
            answer: "whether",
            explanation: "Whether digunakan untuk pertanyaan Yes/No."
        },
        {
            type: "Word Order",
            question: "Which sentence is correct?",
            options: [
                "I know what she wants.",
                "I know what does she want.",
                "I know what wants she.",
                "I know does she want what."
            ],
            answer: "I know what she wants.",
            explanation: "Noun clause memakai statement order."
        },
        {
            type: "Grammar",
            question: "Which sentence contains a noun clause as the object?",
            options: [
                "She believes that he is innocent.",
                "What he said surprised everyone.",
                "The man who helped me is kind.",
                "If it rains, we will stay home."
            ],
            answer: "She believes that he is innocent.",
            explanation: "'That he is innocent' adalah object dari believes."
        },
        {
            type: "Grammar",
            question: "They understand ___ he was angry.",
            options: [
                "why",
                "whose",
                "wherever",
                "whoever"
            ],
            answer: "why",
            explanation: "Why clause menjadi object dari understand."
        },
        {
            type: "Concept",
            question: "Which verb commonly takes a noun clause as its object?",
            options: [
                "know",
                "sleep",
                "arrive",
                "swim"
            ],
            answer: "know",
            explanation: "Know adalah salah satu reporting/cognitive verb yang sering diikuti noun clause."
        },
        {
            type: "Grammar",
            question: "Choose the correct sentence.",
            options: [
                "She asked if I was ready.",
                "She asked if was I ready.",
                "She asked was I ready.",
                "She asked if ready I was."
            ],
            answer: "She asked if I was ready.",
            explanation: "If clause menggunakan urutan statement."
        }
    ]
}, 

"noun-clauses-review": {
    title: "Noun Clauses Review",
    description: "Review akhir untuk menguji pemahaman seluruh materi Noun Clauses: that clauses, WH clauses, whether/if clauses, noun clause as subject, dan noun clause as object.",

    formula: `
        <strong>Ringkasan BAB 10:</strong><br>
        Noun Clause = Connector + Subject + Verb<br>
        Fungsi = Subject / Object / Complement
    `,

    notes: [
        "Noun clause berfungsi sebagai noun.",
        "Noun clause selalu memiliki subject dan verb.",
        "That clause sering digunakan setelah verb seperti think, believe, know, say.",
        "WH clause memakai statement order.",
        "Whether dan if digunakan untuk pertanyaan yes/no.",
        "Noun clause dapat menjadi subject.",
        "Noun clause paling sering menjadi object setelah verb."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "That Clause",
                    formula: "that + subject + verb",
                    examples: [
                        "I believe that he is honest.",
                        "The truth is that nobody knows."
                    ]
                },
                {
                    label: "WH Clause",
                    formula: "WH word + subject + verb",
                    examples: [
                        "I know where she lives.",
                        "What he said surprised me."
                    ]
                },
                {
                    label: "Whether / If",
                    formula: "whether/if + subject + verb",
                    examples: [
                        "I don't know whether he will come.",
                        "She asked if I was ready."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A noun clause functions as...",
            options: ["a noun", "an adjective", "an adverb", "a preposition"],
            answer: "a noun",
            explanation: "Noun clause berfungsi seperti noun."
        },
        {
            type: "Concept",
            question: "A noun clause must contain...",
            options: ["subject and verb", "article only", "adjective only", "preposition only"],
            answer: "subject and verb",
            explanation: "Clause wajib memiliki subject dan verb."
        },
        {
            type: "That Clause",
            question: "I believe ___ he is honest.",
            options: ["that", "where", "when", "whose"],
            answer: "that",
            explanation: "Believe sering diikuti that clause."
        },
        {
            type: "That Clause",
            question: "The truth is ___ nobody knows.",
            options: ["that", "where", "who", "whose"],
            answer: "that",
            explanation: "That clause dapat menjadi complement."
        },
        {
            type: "WH Clause",
            question: "I know ___ she lives.",
            options: ["where", "when", "whose", "that"],
            answer: "where",
            explanation: "Where digunakan untuk tempat."
        },
        {
            type: "WH Clause",
            question: "She explained ___ she was late.",
            options: ["why", "whose", "whom", "which"],
            answer: "why",
            explanation: "Why digunakan untuk alasan."
        },
        {
            type: "WH Clause",
            question: "I don't know ___ he solved it.",
            options: ["how", "whose", "whom", "which"],
            answer: "how",
            explanation: "How digunakan untuk cara."
        },
        {
            type: "Whether/If",
            question: "I don't know ___ he will come.",
            options: ["whether", "whose", "who", "what"],
            answer: "whether",
            explanation: "Whether digunakan untuk kemungkinan yes/no."
        },
        {
            type: "Whether/If",
            question: "She asked ___ I was ready.",
            options: ["if", "whose", "which", "where"],
            answer: "if",
            explanation: "If digunakan untuk pertanyaan yes/no tidak langsung."
        },
        {
            type: "Word Order",
            question: "Which sentence is correct?",
            options: [
                "I know where he lives.",
                "I know where does he live.",
                "I know where lives he.",
                "I know where he does lives."
            ],
            answer: "I know where he lives.",
            explanation: "Noun clause memakai statement order."
        },
        {
            type: "Word Order",
            question: "Choose the correct noun clause.",
            options: [
                "what she wants",
                "what does she want",
                "what wants she",
                "what she does wants"
            ],
            answer: "what she wants",
            explanation: "Urutan benar: connector + subject + verb."
        },
        {
            type: "Subject",
            question: "___ surprised everyone.",
            options: [
                "What he said",
                "What said he",
                "He said what",
                "What saying"
            ],
            answer: "What he said",
            explanation: "Noun clause dapat menjadi subject."
        },
        {
            type: "Subject",
            question: "___ remains uncertain.",
            options: [
                "Whether she agrees",
                "Whether agrees she",
                "She agrees whether",
                "Whether agreeing"
            ],
            answer: "Whether she agrees",
            explanation: "Whether clause dapat menjadi subject."
        },
        {
            type: "Object",
            question: "She believes ___.",
            options: [
                "that he is innocent",
                "that is he innocent",
                "he is that innocent",
                "that innocent he"
            ],
            answer: "that he is innocent",
            explanation: "That clause menjadi object dari believes."
        },
        {
            type: "Object",
            question: "They understand ___ he was angry.",
            options: ["why", "whose", "wherever", "whoever"],
            answer: "why",
            explanation: "Why clause menjadi object dari understand."
        },
        {
            type: "Whether",
            question: "I can't decide ___ buy the blue shirt.",
            options: ["whether to", "if to", "whether", "if"],
            answer: "whether to",
            explanation: "Gunakan whether sebelum to + V1."
        },
        {
            type: "Concept",
            question: "Whether is usually more...",
            options: ["formal", "plural", "passive", "countable"],
            answer: "formal",
            explanation: "Whether lebih formal daripada if."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "What she said made me happy.",
                "What said she made me happy.",
                "She what said made me happy.",
                "What saying she made me happy."
            ],
            answer: "What she said made me happy.",
            explanation: "Noun clause sebagai subject memakai statement order."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She asked if I was ready.",
                "She asked if was I ready.",
                "She asked was I ready.",
                "She asked if ready I was."
            ],
            answer: "She asked if I was ready.",
            explanation: "If clause memakai statement order."
        },
        {
            type: "Final",
            question: "Which sentence contains a noun clause?",
            options: [
                "I know what he wants.",
                "The man who lives there is kind.",
                "The book on the table is mine.",
                "She quickly finished."
            ],
            answer: "I know what he wants.",
            explanation: "'What he wants' berfungsi sebagai object, jadi itu noun clause."
        }
    ]
},

"adverb-clauses": {
    title: "Introduction to Adverb Clauses",
    description: "Adverb Clause adalah dependent clause yang berfungsi seperti adverb. Adverb clause menjelaskan verb, adjective, atau seluruh kalimat dengan memberikan informasi seperti waktu, alasan, tujuan, syarat, kontras, hasil, atau cara.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subordinating Conjunction + Subject + Verb
    `,

    notes: [
        "Adverb clause selalu diawali subordinating conjunction.",
        "Adverb clause adalah dependent clause sehingga tidak dapat berdiri sendiri.",
        "Adverb clause menerangkan verb, adjective, atau seluruh main clause.",
        "Jika adverb clause berada di awal kalimat, gunakan koma.",
        "Jika adverb clause berada di akhir kalimat, biasanya tidak memakai koma.",
        "Connector yang umum antara lain: when, while, before, after, because, since, although, if, unless, so that, as soon as, until."
    ],

    patterns: [
        {
            group: "Beginning of Sentence",
            items: [
                {
                    label: "Clause First",
                    formula: "Adverb Clause, Main Clause",
                    examples: [
                        "When I arrived, she was sleeping.",
                        "Because it was raining, we stayed home.",
                        "Although he was tired, he kept working."
                    ]
                }
            ]
        },
        {
            group: "End of Sentence",
            items: [
                {
                    label: "Main Clause First",
                    formula: "Main Clause + Adverb Clause",
                    examples: [
                        "She was sleeping when I arrived.",
                        "We stayed home because it was raining.",
                        "He kept working although he was tired."
                    ]
                }
            ]
        },
        {
            group: "Common Conjunctions",
            items: [
                {
                    label: "Types",
                    formula: "Subordinating Conjunction",
                    examples: [
                        "Time: when, before, after, while, until",
                        "Reason: because, since, as",
                        "Condition: if, unless",
                        "Contrast: although, though, even though",
                        "Purpose: so that, in order that"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "An adverb clause mainly functions as...",
            options: [
                "an adverb",
                "a noun",
                "an adjective",
                "a pronoun"
            ],
            answer: "an adverb",
            explanation: "Adverb clause berfungsi seperti adverb."
        },
        {
            type: "Concept",
            question: "An adverb clause usually begins with...",
            options: [
                "a subordinating conjunction",
                "an article",
                "a modal verb",
                "a preposition"
            ],
            answer: "a subordinating conjunction",
            explanation: "Adverb clause diawali subordinating conjunction."
        },
        {
            type: "Grammar",
            question: "___ I arrived, she was sleeping.",
            options: [
                "When",
                "Who",
                "Which",
                "Whose"
            ],
            answer: "When",
            explanation: "When memperkenalkan adverb clause of time."
        },
        {
            type: "Grammar",
            question: "We stayed home ___ it was raining.",
            options: [
                "because",
                "where",
                "whose",
                "who"
            ],
            answer: "because",
            explanation: "Because memperkenalkan adverb clause of reason."
        },
        {
            type: "Grammar",
            question: "___ he was tired, he continued working.",
            options: [
                "Although",
                "Whether",
                "That",
                "What"
            ],
            answer: "Although",
            explanation: "Although menunjukkan kontras."
        },
        {
            type: "Comma",
            question: "jika anak kalimat (adverb clause) berada di depan, kita biasanya menggunakan...",
            options: [
                "comma (koma)",
                "Titik koma (;)",
                "Tanda petik ('..')",
                "no punctuation"
            ],
            answer: "a comma",
            explanation: "Gunakan koma jika adverb clause berada di awal."
        },
        {
            type: "Grammar",
            question: "Which sentence is correct?",
            options: [
                "When I arrived, she smiled.",
                "When I arrived she smiled,",
                "When arrived I, she smiled.",
                "When I arrived she, smiled."
            ],
            answer: "When I arrived, she smiled.",
            explanation: "Adverb clause di awal diikuti koma."
        },
        {
            type: "Concept",
            question: "adverb clause tidak bisa berdiri sendiri karena adverb clause adalah...",
            options: [
                "klausa terikat (dependent) ",
                "klausa bebas (independent)",
                "frasa",
                "hanya sebuah fragment kalimat"
            ],
            answer: "a dependent clause",
            explanation: "Adverb clause membutuhkan main clause."
        },
        {
            type: "Comparison",
            question: "Klausa mana yang memodifikasi kata kerja (verb)?",
            options: [
                "Adverb Clause",
                "Noun Clause",
                "Relative Clause",
                "Passive Clause"
            ],
            answer: "Adverb Clause",
            explanation: "Adverb clause menerangkan verb, adjective, atau seluruh kalimat."
        },
        {
            type: "Concept",
            question: "Manakah yang TIDAK biasa digunakan untuk memperkenalkan klausa kata keterangan (adverb clause)?",
            options: [
                "the",
                "because",
                "if",
                "although"
            ],
            answer: "the",
            explanation: "'The' adalah article, bukan subordinating conjunction."
        }
    ]
},

"time-clauses": {
    title: "Time Clauses",
    description: "Time Clause adalah adverb clause yang menunjukkan waktu terjadinya suatu aksi. Clause ini biasanya diawali conjunction seperti when, while, before, after, until, since, dan as soon as.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Time Conjunction + Subject + Verb
    `,

    notes: [
        "When berarti ketika.",
        "While berarti saat dua aksi berlangsung bersamaan.",
        "Before berarti sebelum.",
        "After berarti setelah.",
        "Until berarti sampai.",
        "Since berarti sejak.",
        "As soon as berarti segera setelah.",
        "Dalam time clause untuk masa depan, gunakan Simple Present, bukan will."
    ],

    patterns: [
        {
            group: "Basic Time",
            items: [
                {
                    label: "When",
                    formula: "when + subject + verb",
                    examples: [
                        "When I arrived, she was sleeping.",
                        "Call me when you get home.",
                        "I smiled when I saw her."
                    ]
                },
                {
                    label: "While",
                    formula: "while + subject + verb",
                    examples: [
                        "While I was studying, my phone rang.",
                        "She cooked while I cleaned the room.",
                        "They talked while they were waiting."
                    ]
                }
            ]
        },
        {
            group: "Sequence",
            items: [
                {
                    label: "Before / After",
                    formula: "before/after + subject + verb",
                    examples: [
                        "Before I sleep, I read a book.",
                        "After she finished work, she went home.",
                        "Wash your hands before you eat."
                    ]
                },
                {
                    label: "Until / Since",
                    formula: "until/since + subject + verb",
                    examples: [
                        "Wait here until I come back.",
                        "I have lived here since I was a child.",
                        "She stayed until the meeting ended."
                    ]
                }
            ]
        },
        {
            group: "Future Time Clause",
            items: [
                {
                    label: "No Will",
                    formula: "Time Clause + Simple Present, Main Clause + will",
                    examples: [
                        "I will call you when I arrive.",
                        "She will start after he comes.",
                        "We will leave as soon as the rain stops."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "When",
            question: "___ I arrived, she was sleeping.",
            options: ["When", "Because", "Although", "If"],
            answer: "When",
            explanation: "When digunakan untuk menunjukkan waktu."
        },
        {
            type: "While",
            question: "___ I was studying, my phone rang.",
            options: ["While", "Because", "Unless", "So that"],
            answer: "While",
            explanation: "While digunakan untuk dua aksi yang berlangsung bersamaan."
        },
        {
            type: "Before",
            question: "Wash your hands ___ you eat.",
            options: ["before", "because", "although", "unless"],
            answer: "before",
            explanation: "Before berarti sebelum."
        },
        {
            type: "After",
            question: "___ she finished work, she went home.",
            options: ["After", "Unless", "Although", "So"],
            answer: "After",
            explanation: "After berarti setelah."
        },
        {
            type: "Until",
            question: "Wait here ___ I come back.",
            options: ["until", "because", "although", "whether"],
            answer: "until",
            explanation: "Until berarti sampai."
        },
        {
            type: "Since",
            question: "I have lived here ___ I was a child.",
            options: ["since", "until", "when", "before"],
            answer: "since",
            explanation: "Since berarti sejak."
        },
        {
            type: "As Soon As",
            question: "We will leave ___ the rain stops.",
            options: ["as soon as", "although", "because", "unless"],
            answer: "as soon as",
            explanation: "As soon as berarti segera setelah."
        },
        {
            type: "Future Time",
            question: "I will call you when I ___.",
            options: ["arrive", "will arrive", "arrived", "arriving"],
            answer: "arrive",
            explanation: "Dalam future time clause, gunakan Simple Present, bukan will."
        },
        {
            type: "Error Check",
            question: "Kalimat mana yang tepat?",
            options: [
                "I will call you when I arrive.",
                "I will call you when I will arrive.",
                "I call you when I will arrive.",
                "I will call you when arriving I."
            ],
            answer: "I will call you when I arrive.",
            explanation: "Time clause masa depan memakai Simple Present."
        },
        {
            type: "Concept",
            question: "Time clauses menjelaskan...",
            options: ["ketika sesuatu terjadi", "siapa yang memiliki sesuatu", "berapa banyak noun", "article mana yang dipakai"],
            answer: "ketika sesuatu terjadi",
            explanation: "Time clause menjelaskan waktu terjadinya aksi."
        }
    ]
},

"reason-clauses": {
    title: "Reason Clauses",
    description: "Reason Clause adalah adverb clause yang menjelaskan alasan suatu aksi terjadi. Clause ini biasanya diawali conjunction seperti because, since, dan as.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Reason Conjunction + Subject + Verb
    `,

    notes: [
        "Because digunakan untuk alasan yang jelas dan langsung.",
        "Since digunakan untuk alasan yang sudah diketahui atau dianggap jelas.",
        "As juga dapat digunakan untuk alasan, biasanya lebih formal.",
        "Reason clause dapat berada di awal atau akhir kalimat.",
        "Jika reason clause berada di awal kalimat, gunakan koma.",
        "Because of berbeda dari because. Because of diikuti noun atau gerund, bukan clause."
    ],

    patterns: [
        {
            group: "Because",
            items: [
                {
                    label: "Direct Reason",
                    formula: "because + subject + verb",
                    examples: [
                        "We stayed home because it was raining.",
                        "She was absent because she was sick.",
                        "I studied hard because I wanted to pass."
                    ]
                }
            ]
        },
        {
            group: "Since / As",
            items: [
                {
                    label: "Known Reason",
                    formula: "since/as + subject + verb",
                    examples: [
                        "Since it was late, we went home.",
                        "As she was tired, she took a rest.",
                        "Since he knew the answer, he raised his hand."
                    ]
                }
            ]
        },
        {
            group: "Because vs Because Of",
            items: [
                {
                    label: "Clause vs Noun",
                    formula: "because + clause / because of + noun",
                    examples: [
                        "Because it rained, we stayed home.",
                        "Because of the rain, we stayed home.",
                        "She was late because the traffic was heavy.",
                        "She was late because of the traffic."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Because",
            question: "We stayed home ___ it was raining.",
            options: ["because", "although", "unless", "when"],
            answer: "because",
            explanation: "Because digunakan untuk menunjukkan alasan."
        },
        {
            type: "Because",
            question: "She was absent ___ she was sick.",
            options: ["because", "where", "when", "whose"],
            answer: "because",
            explanation: "Because + subject + verb."
        },
        {
            type: "Since",
            question: "___ it was late, we went home.",
            options: ["Since", "Although", "Unless", "Where"],
            answer: "Since",
            explanation: "Since dapat digunakan untuk alasan yang jelas."
        },
        {
            type: "As",
            question: "___ she was tired, she took a rest.",
            options: ["As", "When", "Where", "Whose"],
            answer: "As",
            explanation: "As dapat berarti karena dalam reason clause."
        },
        {
            type: "Because Of",
            question: "We stayed home because of ___.",
            options: ["the rain", "it was raining", "it rains", "raining it"],
            answer: "the rain",
            explanation: "Because of diikuti noun phrase."
        },
        {
            type: "Because",
            question: "We stayed home because ___.",
            options: ["it was raining", "the rain", "the weather", "heavy traffic"],
            answer: "it was raining",
            explanation: "Because diikuti clause: subject + verb."
        },
        {
            type: "Comma",
            question: "Kaliamt mana yang menggunakan comma dengan benar?",
            options: [
                "Because it was raining, we stayed home.",
                "Because, it was raining we stayed home.",
                "Because it was raining we, stayed home.",
                "Because it, was raining we stayed home."
            ],
            answer: "Because it was raining, we stayed home.",
            explanation: "Jika reason clause di awal, gunakan koma."
        },
        {
            type: "Concept",
            question: "Reason clauses menjelaskan...",
            options: [
                "kenapa sesuatu terjadi",
                "dimana sesuatu tejadi",
                "siapa yang memiliki sesuatu",
                "berapa banyak noun"
            ],
            answer: "kenapa sesuatu terjadi",
            explanation: "Reason clause menjelaskan alasan."
        },
        {
            type: "Error Check",
            question: "Kalimat mana yang tepat?",
            options: [
                "Because he was sick, he stayed home.",
                "Because of he was sick, he stayed home.",
                "Because sick, he stayed home.",
                "Because of was sick, he stayed home."
            ],
            answer: "Because he was sick, he stayed home.",
            explanation: "Because diikuti clause."
        },
        {
            type: "Error Check",
            question: "Kalimat mana yang tepat?",
            options: [
                "Because of the traffic, she was late.",
                "Because the traffic, she was late.",
                "Because of the traffic was heavy, she was late.",
                "Because of she was late, the traffic."
            ],
            answer: "Because of the traffic, she was late.",
            explanation: "Because of diikuti noun phrase."
        }
    ]
},

"contrast-clauses": {
    title: "Contrast Clauses",
    description: "Contrast Clause adalah adverb clause yang menunjukkan pertentangan antara dua ide. Clause ini biasanya diawali conjunction seperti although, though, even though, while, dan whereas.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Contrast Conjunction + Subject + Verb
    `,

    notes: [
        "Although berarti meskipun.",
        "Though memiliki makna mirip dengan although dan lebih umum dalam percakapan.",
        "Even though lebih kuat daripada although.",
        "While dan whereas digunakan untuk membandingkan dua hal yang berbeda.",
        "Jika contrast clause berada di awal kalimat, gunakan koma.",
        "Although/though/even though harus diikuti clause, bukan noun phrase.",
        "Despite dan in spite of bukan conjunction, tetapi preposition phrase dan diikuti noun/gerund."
    ],

    patterns: [
        {
            group: "Although / Though",
            items: [
                {
                    label: "Contrast",
                    formula: "although/though + subject + verb",
                    examples: [
                        "Although he was tired, he kept working.",
                        "Though it was raining, we went outside.",
                        "She smiled although she was sad."
                    ]
                }
            ]
        },
        {
            group: "Even Though",
            items: [
                {
                    label: "Strong Contrast",
                    formula: "even though + subject + verb",
                    examples: [
                        "Even though the test was difficult, she passed.",
                        "Even though he was sick, he came to class.",
                        "They continued even though they were exhausted."
                    ]
                }
            ]
        },
        {
            group: "While / Whereas",
            items: [
                {
                    label: "Comparison",
                    formula: "while/whereas + subject + verb",
                    examples: [
                        "While I like coffee, my brother prefers tea.",
                        "Whereas Jakarta is crowded, this village is quiet.",
                        "She enjoys grammar, while he prefers vocabulary."
                    ]
                }
            ]
        },
        {
            group: "Although vs Despite",
            items: [
                {
                    label: "Clause vs Noun",
                    formula: "although + clause / despite + noun or gerund",
                    examples: [
                        "Although it was raining, we went out.",
                        "Despite the rain, we went out.",
                        "Although he was tired, he worked.",
                        "Despite being tired, he worked."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Although",
            question: "___ he was tired, he kept working.",
            options: ["Although", "Because", "If", "When"],
            answer: "Although",
            explanation: "Although menunjukkan kontras."
        },
        {
            type: "Though",
            question: "___ it was raining, we went outside.",
            options: ["Though", "Because", "Since", "Where"],
            answer: "Though",
            explanation: "Though berarti meskipun."
        },
        {
            type: "Even Though",
            question: "___ the test was difficult, she passed.",
            options: ["Even though", "Because", "Since", "When"],
            answer: "Even though",
            explanation: "Even though menunjukkan kontras yang kuat."
        },
        {
            type: "While",
            question: "___ I like coffee, my brother prefers tea.",
            options: ["While", "Because", "If", "Until"],
            answer: "While",
            explanation: "While dapat digunakan untuk membandingkan dua hal."
        },
        {
            type: "Whereas",
            question: "___ Jakarta is crowded, this village is quiet.",
            options: ["Whereas", "Because", "Since", "When"],
            answer: "Whereas",
            explanation: "Whereas digunakan untuk menunjukkan perbedaan."
        },
        {
            type: "Comma",
            question: "Which sentence uses comma correctly?",
            options: [
                "Although he was tired, he kept working.",
                "Although, he was tired he kept working.",
                "Although he, was tired he kept working.",
                "Although he was tired he, kept working."
            ],
            answer: "Although he was tired, he kept working.",
            explanation: "Jika contrast clause berada di awal, gunakan koma."
        },
        {
            type: "Despite",
            question: "Despite ___, we went outside.",
            options: ["the rain", "it was raining", "it rains", "rain was"],
            answer: "the rain",
            explanation: "Despite diikuti noun phrase, bukan clause."
        },
        {
            type: "Although",
            question: "Although ___, we went outside.",
            options: ["it was raining", "the rain", "rain", "raining"],
            answer: "it was raining",
            explanation: "Although diikuti clause: subject + verb."
        },
        {
            type: "Concept",
            question: "Contrast clauses show...",
            options: [
                "opposition between ideas",
                "time only",
                "ownership",
                "quantity"
            ],
            answer: "opposition between ideas",
            explanation: "Contrast clause menunjukkan pertentangan antara dua ide."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Although she was sick, she attended the class.",
                "Despite she was sick, she attended the class.",
                "Although her sickness, she attended the class.",
                "Even though her sickness, she attended the class."
            ],
            answer: "Although she was sick, she attended the class.",
            explanation: "Although diikuti clause lengkap."
        }
    ]
},
"purpose-result-clauses": {
    title: "Purpose & Result Clauses",
    description: "Purpose Clause menjelaskan tujuan suatu aksi, sedangkan Result Clause menjelaskan hasil atau akibat dari suatu kondisi.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Purpose = so that / in order that + Subject + Verb<br>
        Result = so + adjective/adverb + that + clause<br>
        Result = such + noun phrase + that + clause
    `,

    notes: [
        "Purpose clause menjawab pertanyaan: untuk apa?",
        "Result clause menjawab pertanyaan: apa akibatnya?",
        "So that digunakan untuk tujuan.",
        "In order that lebih formal daripada so that.",
        "So...that digunakan dengan adjective atau adverb.",
        "Such...that digunakan dengan noun phrase.",
        "Can/could/will/would sering muncul dalam purpose clause."
    ],

    patterns: [
        {
            group: "Purpose",
            items: [
                {
                    label: "So That",
                    formula: "so that + subject + can/will + V1",
                    examples: [
                        "I study hard so that I can pass the exam.",
                        "She speaks slowly so that everyone can understand.",
                        "He saved money so that he could buy a car."
                    ]
                },
                {
                    label: "In Order That",
                    formula: "in order that + subject + can/may/will + V1",
                    examples: [
                        "They left early in order that they could arrive on time.",
                        "We practice daily in order that we may improve.",
                        "She wrote clearly in order that people could read it."
                    ]
                }
            ]
        },
        {
            group: "Result",
            items: [
                {
                    label: "So...That",
                    formula: "so + adjective/adverb + that + clause",
                    examples: [
                        "The test was so difficult that many students failed.",
                        "She spoke so quietly that nobody heard her.",
                        "He was so tired that he fell asleep."
                    ]
                },
                {
                    label: "Such...That",
                    formula: "such + noun phrase + that + clause",
                    examples: [
                        "It was such a difficult test that many students failed.",
                        "She is such a kind person that everyone likes her.",
                        "It was such bad weather that we stayed home."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Purpose",
            question: "I study hard ___ I can pass the exam.",
            options: ["so that", "because", "although", "unless"],
            answer: "so that",
            explanation: "So that digunakan untuk menunjukkan tujuan."
        },
        {
            type: "Purpose",
            question: "She speaks slowly so that everyone ___ understand.",
            options: ["can", "because", "although", "unless"],
            answer: "can",
            explanation: "Purpose clause sering memakai can/could."
        },
        {
            type: "Purpose",
            question: "They left early ___ they could arrive on time.",
            options: ["in order that", "although", "because of", "despite"],
            answer: "in order that",
            explanation: "In order that digunakan untuk tujuan dan lebih formal."
        },
        {
            type: "Result",
            question: "The test was ___ difficult that many students failed.",
            options: ["so", "such", "because", "although"],
            answer: "so",
            explanation: "So digunakan sebelum adjective/adverb."
        },
        {
            type: "Result",
            question: "It was ___ a difficult test that many students failed.",
            options: ["such", "so", "because", "although"],
            answer: "such",
            explanation: "Such digunakan sebelum noun phrase."
        },
        {
            type: "Result",
            question: "She is ___ a kind person that everyone likes her.",
            options: ["such", "so", "because", "unless"],
            answer: "such",
            explanation: "A kind person adalah noun phrase, jadi gunakan such."
        },
        {
            type: "Result",
            question: "He was ___ tired that he fell asleep.",
            options: ["so", "such", "because", "while"],
            answer: "so",
            explanation: "Tired adalah adjective, jadi gunakan so."
        },
        {
            type: "Concept",
            question: "Purpose clauses explain...",
            options: ["why someone does something", "who owns something", "where someone lives", "which article to use"],
            answer: "why someone does something",
            explanation: "Purpose clause menjelaskan tujuan."
        },
        {
            type: "Concept",
            question: "Result clauses explain...",
            options: ["the effect or consequence", "possession", "direct speech", "noun function"],
            answer: "the effect or consequence",
            explanation: "Result clause menjelaskan akibat."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The movie was so interesting that I watched it twice.",
                "The movie was such interesting that I watched it twice.",
                "The movie was because interesting that I watched it twice.",
                "The movie was although interesting that I watched it twice."
            ],
            answer: "The movie was so interesting that I watched it twice.",
            explanation: "So + adjective + that + clause."
        }
    ]
},

"condition-clauses": {
    title: "Condition Clauses",
    description: "Condition Clause adalah adverb clause yang menunjukkan syarat agar suatu hasil dapat terjadi. Clause ini biasanya diawali conjunction seperti if, unless, as long as, provided that, dan in case.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Condition Conjunction + Subject + Verb
    `,

    notes: [
        "If berarti jika.",
        "Unless berarti jika tidak / kecuali jika.",
        "As long as berarti selama syarat terpenuhi.",
        "Provided that berarti asalkan.",
        "In case berarti untuk berjaga-jaga jika.",
        "Condition clause dapat berada di awal atau akhir kalimat.",
        "Jika condition clause berada di awal, gunakan koma."
    ],

    patterns: [
        {
            group: "If / Unless",
            items: [
                {
                    label: "If",
                    formula: "if + subject + verb",
                    examples: [
                        "If it rains, we will stay home.",
                        "If you study, you will pass.",
                        "I will help you if I have time."
                    ]
                },
                {
                    label: "Unless",
                    formula: "unless + subject + verb",
                    examples: [
                        "Unless you study, you will fail.",
                        "We will go out unless it rains.",
                        "You cannot enter unless you have a ticket."
                    ]
                }
            ]
        },
        {
            group: "As Long As / Provided That",
            items: [
                {
                    label: "As Long As",
                    formula: "as long as + subject + verb",
                    examples: [
                        "You can borrow my car as long as you drive carefully.",
                        "I will help you as long as you are honest.",
                        "She can join us as long as she arrives on time."
                    ]
                },
                {
                    label: "Provided That",
                    formula: "provided that + subject + verb",
                    examples: [
                        "You may leave early provided that you finish your work.",
                        "The trip will continue provided that the weather is good.",
                        "We will approve it provided that all documents are complete."
                    ]
                }
            ]
        },
        {
            group: "In Case",
            items: [
                {
                    label: "Precaution",
                    formula: "in case + subject + verb",
                    examples: [
                        "Take an umbrella in case it rains.",
                        "Save your work in case the computer crashes.",
                        "Bring extra money in case you need it."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "If",
            question: "___ it rains, we will stay home.",
            options: ["If", "Because", "Although", "When"],
            answer: "If",
            explanation: "If digunakan untuk menunjukkan syarat."
        },
        {
            type: "Unless",
            question: "___ you study, you will fail.",
            options: ["Unless", "Because", "Although", "When"],
            answer: "Unless",
            explanation: "Unless berarti jika tidak."
        },
        {
            type: "Unless",
            question: "We will go out ___ it rains.",
            options: ["unless", "because", "although", "since"],
            answer: "unless",
            explanation: "Unless berarti kecuali jika."
        },
        {
            type: "As Long As",
            question: "You can borrow my car ___ you drive carefully.",
            options: ["as long as", "because", "although", "when"],
            answer: "as long as",
            explanation: "As long as berarti selama syarat terpenuhi."
        },
        {
            type: "Provided That",
            question: "You may leave early ___ you finish your work.",
            options: ["provided that", "although", "because of", "despite"],
            answer: "provided that",
            explanation: "Provided that berarti asalkan."
        },
        {
            type: "In Case",
            question: "Take an umbrella ___ it rains.",
            options: ["in case", "although", "because", "unless"],
            answer: "in case",
            explanation: "In case berarti untuk berjaga-jaga jika."
        },
        {
            type: "Concept",
            question: "Condition clauses explain...",
            options: [
                "the requirement for something to happen",
                "the owner of something",
                "the amount of a noun",
                "the direct quotation"
            ],
            answer: "the requirement for something to happen",
            explanation: "Condition clause menjelaskan syarat."
        },
        {
            type: "Comma",
            question: "Which sentence uses comma correctly?",
            options: [
                "If you study, you will pass.",
                "If, you study you will pass.",
                "If you, study you will pass.",
                "If you study you, will pass."
            ],
            answer: "If you study, you will pass.",
            explanation: "Jika condition clause berada di awal, gunakan koma."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Unless you study, you will fail.",
                "Unless you don't study, you will fail.",
                "Unless studying, you will fail.",
                "Unless you will study, you will fail."
            ],
            answer: "Unless you study, you will fail.",
            explanation: "Unless sudah bermakna negatif, jadi biasanya tidak perlu don't."
        },
        {
            type: "Meaning",
            question: "'Unless you study, you will fail' means...",
            options: [
                "If you do not study, you will fail.",
                "If you study, you will fail.",
                "Because you study, you will fail.",
                "Although you study, you will fail."
            ],
            answer: "If you do not study, you will fail.",
            explanation: "Unless berarti if not."
        }
    ]
},

"adverb-clauses-review": {
    title: "Adverb Clauses Review",
    description: "Review akhir untuk menguji seluruh materi Adverb Clauses: time, reason, contrast, purpose, result, dan condition clauses.",

    formula: `
        <strong>Ringkasan BAB 11:</strong><br>
        Adverb Clause = Subordinating Conjunction + Subject + Verb<br>
        Fungsi = menjelaskan waktu, alasan, kontras, tujuan, hasil, atau syarat
    `,

    notes: [
        "Time clause menjelaskan waktu.",
        "Reason clause menjelaskan alasan.",
        "Contrast clause menunjukkan pertentangan.",
        "Purpose clause menjelaskan tujuan.",
        "Result clause menjelaskan akibat.",
        "Condition clause menjelaskan syarat.",
        "Jika adverb clause berada di awal kalimat, gunakan koma."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Time / Reason",
                    formula: "when, while, before, after / because, since, as",
                    examples: [
                        "When I arrived, she was sleeping.",
                        "Because it was raining, we stayed home."
                    ]
                },
                {
                    label: "Contrast / Purpose",
                    formula: "although, even though / so that, in order that",
                    examples: [
                        "Although he was tired, he kept working.",
                        "I study hard so that I can pass."
                    ]
                },
                {
                    label: "Result / Condition",
                    formula: "so...that, such...that / if, unless, as long as",
                    examples: [
                        "He was so tired that he fell asleep.",
                        "If you study, you will pass."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Time",
            question: "___ I arrived, she was sleeping.",
            options: ["When", "Because", "Although", "Unless"],
            answer: "When",
            explanation: "When digunakan untuk time clause."
        },
        {
            type: "Time",
            question: "I will call you when I ___.",
            options: ["arrive", "will arrive", "arrived", "arriving"],
            answer: "arrive",
            explanation: "Future time clause memakai Simple Present, bukan will."
        },
        {
            type: "Reason",
            question: "We stayed home ___ it was raining.",
            options: ["because", "although", "unless", "when"],
            answer: "because",
            explanation: "Because menunjukkan alasan."
        },
        {
            type: "Reason",
            question: "Because of ___, we stayed home.",
            options: ["the rain", "it was raining", "it rains", "rain was"],
            answer: "the rain",
            explanation: "Because of diikuti noun phrase."
        },
        {
            type: "Contrast",
            question: "___ he was tired, he kept working.",
            options: ["Although", "Because", "If", "When"],
            answer: "Although",
            explanation: "Although menunjukkan kontras."
        },
        {
            type: "Contrast",
            question: "___ city life is noisy, village life is peaceful.",
            options: ["Whereas", "Because", "Since", "Until"],
            answer: "Whereas",
            explanation: "Whereas menunjukkan perbandingan kontras."
        },
        {
            type: "Purpose",
            question: "I study hard ___ I can pass the exam.",
            options: ["so that", "because", "although", "unless"],
            answer: "so that",
            explanation: "So that menunjukkan tujuan."
        },
        {
            type: "Purpose",
            question: "They left early ___ they could arrive on time.",
            options: ["in order that", "although", "because of", "despite"],
            answer: "in order that",
            explanation: "In order that digunakan untuk tujuan secara formal."
        },
        {
            type: "Result",
            question: "The test was ___ difficult that many students failed.",
            options: ["so", "such", "because", "although"],
            answer: "so",
            explanation: "So digunakan sebelum adjective/adverb."
        },
        {
            type: "Result",
            question: "It was ___ a difficult test that many students failed.",
            options: ["such", "so", "because", "although"],
            answer: "such",
            explanation: "Such digunakan sebelum noun phrase."
        },
        {
            type: "Condition",
            question: "___ it rains, we will stay home.",
            options: ["If", "Because", "Although", "When"],
            answer: "If",
            explanation: "If menunjukkan syarat."
        },
        {
            type: "Condition",
            question: "___ you study, you will fail.",
            options: ["Unless", "Because", "Although", "When"],
            answer: "Unless",
            explanation: "Unless berarti if not."
        },
        {
            type: "Condition",
            question: "You can join us ___ you arrive on time.",
            options: ["as long as", "although", "because", "when"],
            answer: "as long as",
            explanation: "As long as berarti selama syarat terpenuhi."
        },
        {
            type: "Condition",
            question: "Take an umbrella ___ it rains.",
            options: ["in case", "although", "because", "unless"],
            answer: "in case",
            explanation: "In case berarti untuk berjaga-jaga."
        },
        {
            type: "Comma",
            question: "Which sentence uses comma correctly?",
            options: [
                "Because it was raining, we stayed home.",
                "Because, it was raining we stayed home.",
                "Because it was raining we, stayed home.",
                "Because it, was raining we stayed home."
            ],
            answer: "Because it was raining, we stayed home.",
            explanation: "Jika adverb clause berada di awal, gunakan koma."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Although he was tired, he kept working.",
                "Although he was tired, but he kept working.",
                "Although tired he, kept working.",
                "Although he tired, he kept working."
            ],
            answer: "Although he was tired, he kept working.",
            explanation: "Jangan gunakan although dan but bersamaan."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Unless you study, you will fail.",
                "Unless you don't study, you will fail.",
                "Unless studying, you will fail.",
                "Unless you will study, you will fail."
            ],
            answer: "Unless you study, you will fail.",
            explanation: "Unless sudah bermakna negatif."
        },
        {
            type: "Concept",
            question: "Adverb clauses are introduced by...",
            options: [
                "subordinating conjunctions",
                "articles only",
                "relative pronouns only",
                "possessive determiners"
            ],
            answer: "subordinating conjunctions",
            explanation: "Adverb clause diawali subordinating conjunction."
        },
        {
            type: "Concept",
            question: "An adverb clause is...",
            options: [
                "a dependent clause",
                "an independent sentence only",
                "a noun phrase",
                "an article phrase"
            ],
            answer: "a dependent clause",
            explanation: "Adverb clause tidak dapat berdiri sendiri."
        },
        {
            type: "Final",
            question: "Which sentence contains an adverb clause?",
            options: [
                "When I arrived, she smiled.",
                "The man who helped me is kind.",
                "What he said surprised me.",
                "The book on the table is mine."
            ],
            answer: "When I arrived, she smiled.",
            explanation: "When I arrived adalah adverb clause of time."
        }
    ]
},

"inversion": {
    title: "Introduction to Inversion",
    description: "Inversion adalah struktur grammar ketika auxiliary verb diletakkan sebelum subject. Inversion sering digunakan dalam tulisan formal, akademik, sastra, dan soal grammar tingkat lanjut.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Normal: Subject + Auxiliary + Verb<br>
        Inversion: Auxiliary + Subject + Verb
    `,

    notes: [
        "Inversion berarti posisi auxiliary verb berpindah ke depan subject.",
        "Struktur inversion mirip dengan bentuk pertanyaan, tetapi maknanya bukan selalu pertanyaan.",
        "Inversion sering muncul setelah negative adverbial seperti never, rarely, seldom, hardly, no sooner.",
        "Inversion juga muncul setelah only, so, such, dan conditional inversion.",
        "Jika tidak ada auxiliary verb, gunakan do/does/did.",
        "Inversion umum dalam tulisan formal dan soal grammar advanced."
    ],

    patterns: [
        {
            group: "Basic Inversion",
            items: [
                {
                    label: "With Auxiliary",
                    formula: "Auxiliary + Subject + Verb",
                    examples: [
                        "Normal: She has never seen such a view.",
                        "Inversion: Never has she seen such a view.",
                        "Normal: He can rarely finish the task.",
                        "Inversion: Rarely can he finish the task."
                    ]
                },
                {
                    label: "With Do/Does/Did",
                    formula: "Negative Adverbial + do/does/did + Subject + V1",
                    examples: [
                        "Normal: She rarely visits us.",
                        "Inversion: Rarely does she visit us.",
                        "Normal: He never understood the problem.",
                        "Inversion: Never did he understand the problem."
                    ]
                }
            ]
        },
        {
            group: "Common Triggers",
            items: [
                {
                    label: "Negative / Restrictive Words",
                    formula: "Trigger + Auxiliary + Subject + Verb",
                    examples: [
                        "Never have I heard such news.",
                        "Rarely do we see such kindness.",
                        "Only then did I understand the truth.",
                        "So beautiful was the view that we stopped walking."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Inversion means...",
            options: [
                "auxiliary verb comes before subject",
                "subject disappears",
                "verb becomes noun",
                "article comes after noun"
            ],
            answer: "auxiliary verb comes before subject",
            explanation: "Inversion terjadi ketika auxiliary verb diletakkan sebelum subject."
        },
        {
            type: "Structure",
            question: "Which sentence uses inversion?",
            options: [
                "Never have I seen such a view.",
                "I have never seen such a view.",
                "I never have seen such a view.",
                "Such a view I have never seen."
            ],
            answer: "Never have I seen such a view.",
            explanation: "Have muncul sebelum subject I."
        },
        {
            type: "Auxiliary",
            question: "Normal: She rarely visits us. Inversion: Rarely ___ she visit us.",
            options: ["does", "do", "did", "has"],
            answer: "does",
            explanation: "Jika tidak ada auxiliary, gunakan do/does/did. Subject she memakai does."
        },
        {
            type: "Auxiliary",
            question: "Normal: He never understood the problem. Inversion: Never ___ he understand the problem.",
            options: ["does", "do", "did", "has"],
            answer: "did",
            explanation: "Simple Past memakai did + V1 dalam inversion."
        },
        {
            type: "Word Order",
            question: "Which word order is correct for inversion?",
            options: [
                "Never have I heard this story.",
                "Never I have heard this story.",
                "Never heard I have this story.",
                "Never this story I have heard."
            ],
            answer: "Never have I heard this story.",
            explanation: "Pola inversion: trigger + auxiliary + subject + verb."
        },
        {
            type: "Trigger",
            question: "Which word commonly triggers inversion?",
            options: ["Never", "Beautiful", "Book", "Quickly"],
            answer: "Never",
            explanation: "Never adalah negative adverbial yang sering memicu inversion."
        },
        {
            type: "Trigger",
            question: "Which phrase commonly triggers inversion?",
            options: ["Only then", "Very happy", "A book", "Many students"],
            answer: "Only then",
            explanation: "Only then dapat memicu inversion."
        },
        {
            type: "Concept",
            question: "Inversion is common in...",
            options: [
                "formal and advanced English",
                "articles only",
                "plural noun formation",
                "basic spelling only"
            ],
            answer: "formal and advanced English",
            explanation: "Inversion sering muncul dalam bahasa formal, akademik, dan grammar advanced."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Rarely does she speak in public.",
                "Rarely she does speak in public.",
                "Rarely she speaks in public.",
                "Rarely speaks she in public."
            ],
            answer: "Rarely does she speak in public.",
            explanation: "Rarely + does + subject + V1."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Only then did I realize the mistake.",
                "Only then I did realize the mistake.",
                "Only then I realized the mistake.",
                "Only then realized I the mistake."
            ],
            answer: "Only then did I realize the mistake.",
            explanation: "Only then memicu inversion: did + subject + V1."
        }
    ]
},

"negative-adverbial-inversion": {
    title: "Negative Adverbial Inversion",
    description: "Negative Adverbial Inversion terjadi ketika kata atau frasa negatif diletakkan di awal kalimat, lalu auxiliary verb berpindah ke depan subject. Struktur ini umum digunakan dalam tulisan formal dan grammar tingkat lanjut.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Negative Adverbial + Auxiliary + Subject + Main Verb
    `,

    notes: [
        "Negative adverbial seperti never, rarely, seldom, hardly, scarcely, little, dan under no circumstances dapat memicu inversion.",
        "Jika kalimat sudah memiliki auxiliary, pindahkan auxiliary ke depan subject.",
        "Jika tidak ada auxiliary, gunakan do/does/did.",
        "Setelah do/does/did, main verb kembali ke V1.",
        "Struktur ini bersifat formal dan sering muncul di soal grammar advanced.",
        "Makna kalimat tetap sama, tetapi penekanan menjadi lebih kuat."
    ],

    patterns: [
        {
            group: "Never / Rarely / Seldom",
            items: [
                {
                    label: "Frequency",
                    formula: "Never/Rarely/Seldom + auxiliary + subject + verb",
                    examples: [
                        "Never have I seen such beauty.",
                        "Rarely does she speak in public.",
                        "Seldom do we receive such good news."
                    ]
                }
            ]
        },
        {
            group: "Hardly / Scarcely",
            items: [
                {
                    label: "Almost Never",
                    formula: "Hardly/Scarcely + auxiliary + subject + verb",
                    examples: [
                        "Hardly had I arrived when it started raining.",
                        "Scarcely had she entered the room when the phone rang.",
                        "Hardly does he ever complain."
                    ]
                }
            ]
        },
        {
            group: "Little / Under No Circumstances",
            items: [
                {
                    label: "Strong Negative",
                    formula: "Negative phrase + auxiliary + subject + verb",
                    examples: [
                        "Little did I know about the danger.",
                        "Under no circumstances should you open this door.",
                        "At no time did he admit his mistake."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Never",
            question: "___ have I seen such a beautiful place.",
            options: ["Never", "Always", "Often", "Usually"],
            answer: "Never",
            explanation: "Never di awal kalimat memicu inversion."
        },
        {
            type: "Rarely",
            question: "Rarely ___ she speak in public.",
            options: ["does", "do", "did", "has"],
            answer: "does",
            explanation: "Simple Present dengan subject she memakai does + V1."
        },
        {
            type: "Seldom",
            question: "Seldom ___ we receive such good news.",
            options: ["do", "does", "did", "has"],
            answer: "do",
            explanation: "Subject we memakai do."
        },
        {
            type: "Hardly",
            question: "Hardly ___ I arrived when it started raining.",
            options: ["had", "has", "do", "does"],
            answer: "had",
            explanation: "Hardly had + subject + V3 sering dipakai dengan when."
        },
        {
            type: "Scarcely",
            question: "Scarcely ___ she entered the room when the phone rang.",
            options: ["had", "has", "does", "do"],
            answer: "had",
            explanation: "Scarcely had + subject + V3."
        },
        {
            type: "Little",
            question: "Little ___ I know about the danger.",
            options: ["did", "do", "does", "has"],
            answer: "did",
            explanation: "Little di awal memicu inversion. Simple Past memakai did + V1."
        },
        {
            type: "Negative Phrase",
            question: "Under no circumstances ___ you open this door.",
            options: ["should", "do", "does", "had"],
            answer: "should",
            explanation: "Under no circumstances memicu inversion dengan auxiliary should."
        },
        {
            type: "Word Order",
            question: "Which sentence is correct?",
            options: [
                "Never have I heard such news.",
                "Never I have heard such news.",
                "Never heard I have such news.",
                "Never such news I have heard."
            ],
            answer: "Never have I heard such news.",
            explanation: "Pola benar: negative adverbial + auxiliary + subject + verb."
        },
        {
            type: "Do Support",
            question: "Normal: She rarely visits us. Inversion:",
            options: [
                "Rarely does she visit us.",
                "Rarely she visits us.",
                "Rarely she does visit us.",
                "Rarely visits she us."
            ],
            answer: "Rarely does she visit us.",
            explanation: "Jika tidak ada auxiliary, gunakan does dan verb kembali ke V1."
        },
        {
            type: "Concept",
            question: "Negative adverbial inversion is mostly used in...",
            options: [
                "formal English",
                "article usage",
                "plural noun formation",
                "basic spelling"
            ],
            answer: "formal English",
            explanation: "Struktur ini umum pada formal/advanced English."
        }
    ]
},

"only-inversion": {
    title: "Only Inversion",
    description: "Only Inversion terjadi ketika frasa yang diawali only diletakkan di awal kalimat, lalu auxiliary verb berpindah ke depan subject. Struktur ini sering digunakan untuk memberi penekanan dalam bahasa formal.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Only + Adverbial Expression + Auxiliary + Subject + Verb
    `,

    notes: [
        "Only inversion terjadi jika frasa only berada di awal kalimat.",
        "Only then berarti hanya setelah itu.",
        "Only after berarti hanya setelah.",
        "Only when berarti hanya ketika.",
        "Only if berarti hanya jika.",
        "Only by berarti hanya dengan cara.",
        "Jika tidak ada auxiliary, gunakan do/does/did.",
        "Inversion terjadi pada main clause, bukan pada clause setelah only."
    ],

    patterns: [
        {
            group: "Only Then / Only Later",
            items: [
                {
                    label: "Time Point",
                    formula: "Only then/later + auxiliary + subject + verb",
                    examples: [
                        "Only then did I understand the truth.",
                        "Only later did she realize her mistake.",
                        "Only then did they accept the result."
                    ]
                }
            ]
        },
        {
            group: "Only After / Only When",
            items: [
                {
                    label: "Time Clause",
                    formula: "Only after/when + clause + auxiliary + subject + verb",
                    examples: [
                        "Only after I arrived did I realize the problem.",
                        "Only when she explained it did I understand.",
                        "Only after the meeting ended did they leave."
                    ]
                }
            ]
        },
        {
            group: "Only If / Only By",
            items: [
                {
                    label: "Condition / Method",
                    formula: "Only if/by + phrase/clause + auxiliary + subject + verb",
                    examples: [
                        "Only if you study will you pass the exam.",
                        "Only by practicing every day can you improve.",
                        "Only by working together did they finish the project."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Only Then",
            question: "Only then ___ I understand the truth.",
            options: ["did", "do", "does", "had"],
            answer: "did",
            explanation: "Only then memicu inversion. Simple Past memakai did + V1."
        },
        {
            type: "Only Later",
            question: "Only later ___ she realize her mistake.",
            options: ["did", "does", "do", "has"],
            answer: "did",
            explanation: "Only later + did + subject + V1."
        },
        {
            type: "Only After",
            question: "Only after I arrived ___ I realize the problem.",
            options: ["did", "do", "does", "am"],
            answer: "did",
            explanation: "Inversion terjadi pada main clause: did I realize."
        },
        {
            type: "Only When",
            question: "Only when she explained it ___ I understand.",
            options: ["did", "do", "does", "had"],
            answer: "did",
            explanation: "Only when + clause + did + subject + V1."
        },
        {
            type: "Only If",
            question: "Only if you study ___ you pass the exam.",
            options: ["will", "would", "did", "do"],
            answer: "will",
            explanation: "Only if memicu inversion pada main clause: will you pass."
        },
        {
            type: "Only By",
            question: "Only by practicing every day ___ you improve.",
            options: ["can", "do", "does", "did"],
            answer: "can",
            explanation: "Only by + gerund phrase + can + subject + V1."
        },
        {
            type: "Word Order",
            question: "Which sentence is correct?",
            options: [
                "Only then did I understand.",
                "Only then I did understand.",
                "Only then I understood.",
                "Only then understood I."
            ],
            answer: "Only then did I understand.",
            explanation: "Pola benar: only phrase + auxiliary + subject + verb."
        },
        {
            type: "Main Clause",
            question: "In 'Only after I arrived did I realize the problem', inversion happens in...",
            options: ["the main clause", "the after-clause", "both clauses", "no clause"],
            answer: "the main clause",
            explanation: "Inversion terjadi pada main clause: did I realize."
        },
        {
            type: "Concept",
            question: "Only inversion is common in...",
            options: ["formal English", "article formation", "plural noun spelling", "basic pronunciation"],
            answer: "formal English",
            explanation: "Only inversion sering digunakan dalam gaya formal dan tulisan akademik."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Only by working hard can you succeed.",
                "Only by working hard you can succeed.",
                "Only by work hard can you succeed.",
                "Only by working hard succeed you can."
            ],
            answer: "Only by working hard can you succeed.",
            explanation: "Only by + gerund phrase + auxiliary + subject + verb."
        }
    ]
},

"so-such-inversion": {
    title: "So & Such Inversion",
    description: "So & Such Inversion digunakan untuk memberi penekanan pada tingkat atau intensitas sesuatu. Struktur ini biasanya muncul dalam bahasa formal, sastra, dan soal grammar tingkat lanjut.",

    formula: `
        <strong>Inti Materi:</strong><br>
        So + adjective/adverb + auxiliary + subject + verb + that + clause<br>
        Such + be + noun phrase + that + clause
    `,

    notes: [
        "So inversion digunakan dengan adjective atau adverb.",
        "Such inversion digunakan dengan noun phrase.",
        "Struktur ini memberikan penekanan kuat.",
        "So inversion memakai pola auxiliary + subject.",
        "Such inversion sering memakai be + noun phrase.",
        "Maknanya mirip dengan so...that dan such...that biasa, tetapi lebih formal."
    ],

    patterns: [
        {
            group: "So Inversion",
            items: [
                {
                    label: "So + Adjective",
                    formula: "So + adjective + be + subject + that + clause",
                    examples: [
                        "So beautiful was the view that we stopped walking.",
                        "So difficult was the test that many students failed.",
                        "So tired was he that he fell asleep immediately."
                    ]
                },
                {
                    label: "So + Adverb",
                    formula: "So + adverb + auxiliary + subject + verb + that + clause",
                    examples: [
                        "So quickly did she run that nobody could catch her.",
                        "So loudly did he speak that everyone heard him.",
                        "So well did they perform that the audience applauded."
                    ]
                }
            ]
        },
        {
            group: "Such Inversion",
            items: [
                {
                    label: "Such + Noun Phrase",
                    formula: "Such + be + noun phrase + that + clause",
                    examples: [
                        "Such was the noise that we could not sleep.",
                        "Such was his anger that nobody dared to speak.",
                        "Such was the impact that the policy changed immediately."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "So Adjective",
            question: "So beautiful ___ the view that we stopped walking.",
            options: ["was", "were", "did", "has"],
            answer: "was",
            explanation: "So + adjective + be + subject + that clause."
        },
        {
            type: "So Adjective",
            question: "So difficult ___ the test that many students failed.",
            options: ["was", "were", "did", "do"],
            answer: "was",
            explanation: "The test adalah singular, jadi gunakan was."
        },
        {
            type: "So Adverb",
            question: "So quickly ___ she run that nobody could catch her.",
            options: ["did", "does", "do", "was"],
            answer: "did",
            explanation: "So + adverb memakai auxiliary + subject + V1."
        },
        {
            type: "So Adverb",
            question: "So loudly ___ he speak that everyone heard him.",
            options: ["did", "does", "do", "was"],
            answer: "did",
            explanation: "Simple Past memakai did + V1."
        },
        {
            type: "Such",
            question: "Such ___ the noise that we could not sleep.",
            options: ["was", "were", "did", "has"],
            answer: "was",
            explanation: "Such inversion sering memakai Such + was/were + noun phrase."
        },
        {
            type: "Such",
            question: "Such ___ his anger that nobody dared to speak.",
            options: ["was", "were", "did", "do"],
            answer: "was",
            explanation: "His anger adalah singular uncountable concept, jadi gunakan was."
        },
        {
            type: "Concept",
            question: "So inversion is mainly used with...",
            options: [
                "adjectives or adverbs",
                "articles only",
                "possessive nouns only",
                "plural markers only"
            ],
            answer: "adjectives or adverbs",
            explanation: "So inversion menekankan adjective atau adverb."
        },
        {
            type: "Concept",
            question: "Such inversion is mainly used with...",
            options: [
                "noun phrases",
                "adverbs only",
                "modal verbs only",
                "prepositions only"
            ],
            answer: "noun phrases",
            explanation: "Such inversion menekankan noun phrase."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "So beautiful was the view that we stopped.",
                "So beautiful the view was that we stopped.",
                "So was beautiful the view that we stopped.",
                "So beautiful did the view that we stopped."
            ],
            answer: "So beautiful was the view that we stopped.",
            explanation: "Pola benar: So + adjective + be + subject."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "So quickly did she run that nobody caught her.",
                "So quickly she did run that nobody caught her.",
                "So quickly she ran did that nobody caught her.",
                "So quickly was she run that nobody caught her."
            ],
            answer: "So quickly did she run that nobody caught her.",
            explanation: "So + adverb + did + subject + V1."
        }
    ]
},

"conditional-inversion": {
    title: "Conditional Inversion",
    description: "Conditional Inversion adalah bentuk formal dari conditional sentence dengan menghilangkan if dan membalik posisi auxiliary verb ke depan subject.",

    formula: `
        <strong>Inti Materi:</strong><br>
        If + Subject + Auxiliary → Auxiliary + Subject<br><br>
        If I were you → Were I you<br>
        If he had known → Had he known<br>
        If you should need help → Should you need help
    `,

    notes: [
        "Conditional inversion digunakan dalam bahasa formal dan tulisan akademik.",
        "If dihilangkan dalam conditional inversion.",
        "Auxiliary verb dipindahkan ke depan subject.",
        "Were digunakan untuk Second Conditional.",
        "Had digunakan untuk Third Conditional.",
        "Should digunakan untuk kemungkinan formal di masa depan.",
        "Conditional inversion tidak umum dalam percakapan sehari-hari."
    ],

    patterns: [
        {
            group: "Were Inversion",
            items: [
                {
                    label: "Second Conditional",
                    formula: "Were + Subject + Complement, Subject + would + V1",
                    examples: [
                        "If I were you, I would apologize.",
                        "Were I you, I would apologize.",
                        "Were she here, she would help us."
                    ]
                }
            ]
        },
        {
            group: "Had Inversion",
            items: [
                {
                    label: "Third Conditional",
                    formula: "Had + Subject + V3, Subject + would have + V3",
                    examples: [
                        "If I had known, I would have helped.",
                        "Had I known, I would have helped.",
                        "Had she studied, she would have passed."
                    ]
                }
            ]
        },
        {
            group: "Should Inversion",
            items: [
                {
                    label: "Formal Future Condition",
                    formula: "Should + Subject + V1, Subject + will/would/can + V1",
                    examples: [
                        "If you should need help, call me.",
                        "Should you need help, call me.",
                        "Should they arrive early, we will start the meeting."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Were",
            question: "___ I you, I would apologize.",
            options: ["Were", "Had", "Should", "Did"],
            answer: "Were",
            explanation: "Were I you adalah inversion dari If I were you."
        },
        {
            type: "Were",
            question: "Were she here, she ___ help us.",
            options: ["would", "will", "had", "has"],
            answer: "would",
            explanation: "Were inversion mengikuti pola Second Conditional."
        },
        {
            type: "Had",
            question: "___ I known, I would have helped.",
            options: ["Had", "Were", "Should", "Did"],
            answer: "Had",
            explanation: "Had I known adalah inversion dari If I had known."
        },
        {
            type: "Had",
            question: "Had she studied, she ___ passed.",
            options: ["would have", "would", "will", "had"],
            answer: "would have",
            explanation: "Had inversion mengikuti pola Third Conditional."
        },
        {
            type: "Should",
            question: "___ you need help, call me.",
            options: ["Should", "Had", "Were", "Did"],
            answer: "Should",
            explanation: "Should inversion digunakan untuk kondisi formal di masa depan."
        },
        {
            type: "Transform",
            question: "If I were you, I would accept the offer. Inversion form is...",
            options: [
                "Were I you, I would accept the offer.",
                "Had I you, I would accept the offer.",
                "Should I you, I would accept the offer.",
                "Did I you, I would accept the offer."
            ],
            answer: "Were I you, I would accept the offer.",
            explanation: "If I were you berubah menjadi Were I you."
        },
        {
            type: "Transform",
            question: "If she had known, she would have come. Inversion form is...",
            options: [
                "Had she known, she would have come.",
                "Were she known, she would have come.",
                "Should she known, she would have come.",
                "Did she had known, she would have come."
            ],
            answer: "Had she known, she would have come.",
            explanation: "If she had known berubah menjadi Had she known."
        },
        {
            type: "Concept",
            question: "In conditional inversion, the word 'if' is usually...",
            options: ["removed", "repeated", "changed to because", "changed to although"],
            answer: "removed",
            explanation: "Conditional inversion menghilangkan if."
        },
        {
            type: "Concept",
            question: "Conditional inversion is mostly used in...",
            options: ["formal English", "basic spelling", "articles only", "plural nouns only"],
            answer: "formal English",
            explanation: "Conditional inversion bersifat formal."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Had I known, I would have helped.",
                "Had I knew, I would have helped.",
                "If had I known, I would have helped.",
                "Did I had known, I would have helped."
            ],
            answer: "Had I known, I would have helped.",
            explanation: "Had + subject + V3 adalah pola conditional inversion yang benar."
        }
    ]
},

"inversion-review": {
    title: "Inversion Review",
    description: "Review akhir untuk menguji seluruh materi Inversion: basic inversion, negative adverbial inversion, only inversion, so/such inversion, dan conditional inversion.",

    formula: `
        <strong>Ringkasan BAB 12:</strong><br>
        Inversion = Auxiliary + Subject + Verb<br>
        Negative Adverbial + Auxiliary + Subject + Verb<br>
        Only Phrase + Auxiliary + Subject + Verb<br>
        So/Such + Inversion + That Clause<br>
        Were/Had/Should + Subject = Conditional Inversion
    `,

    notes: [
        "Inversion memindahkan auxiliary ke depan subject.",
        "Negative adverbial seperti never, rarely, seldom, hardly, dan little dapat memicu inversion.",
        "Only phrase seperti only then, only after, only when, dan only by dapat memicu inversion.",
        "So inversion digunakan dengan adjective atau adverb.",
        "Such inversion digunakan dengan noun phrase.",
        "Conditional inversion menghilangkan if dan memindahkan were, had, atau should ke depan subject."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Negative",
                    formula: "Never/Rarely/Seldom + auxiliary + subject + verb",
                    examples: [
                        "Never have I seen such beauty.",
                        "Rarely does she speak in public.",
                        "Little did I know about the danger."
                    ]
                },
                {
                    label: "Only",
                    formula: "Only + phrase/clause + auxiliary + subject + verb",
                    examples: [
                        "Only then did I understand.",
                        "Only after I arrived did I realize the problem.",
                        "Only by practicing can you improve."
                    ]
                },
                {
                    label: "Conditional",
                    formula: "Were/Had/Should + subject + verb",
                    examples: [
                        "Were I you, I would apologize.",
                        "Had I known, I would have helped.",
                        "Should you need help, call me."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Basic",
            question: "Inversion means...",
            options: [
                "auxiliary before subject",
                "subject before auxiliary only",
                "noun before article",
                "adjective before verb"
            ],
            answer: "auxiliary before subject",
            explanation: "Inversion memindahkan auxiliary ke depan subject."
        },
        {
            type: "Negative",
            question: "Never ___ I seen such beauty.",
            options: ["have", "has", "do", "does"],
            answer: "have",
            explanation: "Never + have + subject + V3."
        },
        {
            type: "Negative",
            question: "Rarely ___ she speak in public.",
            options: ["does", "do", "did", "has"],
            answer: "does",
            explanation: "Rarely + does + she + V1."
        },
        {
            type: "Negative",
            question: "Little ___ I know about the danger.",
            options: ["did", "do", "does", "has"],
            answer: "did",
            explanation: "Little + did + subject + V1."
        },
        {
            type: "Hardly",
            question: "Hardly ___ I arrived when it started raining.",
            options: ["had", "has", "do", "does"],
            answer: "had",
            explanation: "Hardly had + subject + V3."
        },
        {
            type: "Only",
            question: "Only then ___ I understand the truth.",
            options: ["did", "do", "does", "had"],
            answer: "did",
            explanation: "Only then + did + subject + V1."
        },
        {
            type: "Only",
            question: "Only by practicing every day ___ you improve.",
            options: ["can", "do", "does", "did"],
            answer: "can",
            explanation: "Only by + gerund phrase + can + subject + V1."
        },
        {
            type: "Only",
            question: "Only if you study ___ you pass the exam.",
            options: ["will", "did", "do", "does"],
            answer: "will",
            explanation: "Only if memicu inversion pada main clause."
        },
        {
            type: "So",
            question: "So beautiful ___ the view that we stopped walking.",
            options: ["was", "were", "did", "has"],
            answer: "was",
            explanation: "So + adjective + be + subject + that clause."
        },
        {
            type: "So",
            question: "So quickly ___ she run that nobody could catch her.",
            options: ["did", "does", "do", "was"],
            answer: "did",
            explanation: "So + adverb + did + subject + V1."
        },
        {
            type: "Such",
            question: "Such ___ the noise that we could not sleep.",
            options: ["was", "were", "did", "has"],
            answer: "was",
            explanation: "Such inversion memakai be + noun phrase."
        },
        {
            type: "Conditional",
            question: "___ I you, I would apologize.",
            options: ["Were", "Had", "Should", "Did"],
            answer: "Were",
            explanation: "Were I you = If I were you."
        },
        {
            type: "Conditional",
            question: "___ I known, I would have helped.",
            options: ["Had", "Were", "Should", "Did"],
            answer: "Had",
            explanation: "Had I known = If I had known."
        },
        {
            type: "Conditional",
            question: "___ you need help, call me.",
            options: ["Should", "Had", "Were", "Did"],
            answer: "Should",
            explanation: "Should you need help = If you should need help."
        },
        {
            type: "Transform",
            question: "Normal: She rarely visits us. Inversion:",
            options: [
                "Rarely does she visit us.",
                "Rarely she visits us.",
                "Rarely she does visit us.",
                "Rarely visits she us."
            ],
            answer: "Rarely does she visit us.",
            explanation: "Jika tidak ada auxiliary, gunakan does + V1."
        },
        {
            type: "Transform",
            question: "If she had known, she would have come. Inversion:",
            options: [
                "Had she known, she would have come.",
                "Had she knew, she would have come.",
                "Were she known, she would have come.",
                "Should she known, she would have come."
            ],
            answer: "Had she known, she would have come.",
            explanation: "If she had known berubah menjadi Had she known."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Only then did I realize the mistake.",
                "Only then I did realize the mistake.",
                "Only then I realized the mistake.",
                "Only then realized I the mistake."
            ],
            answer: "Only then did I realize the mistake.",
            explanation: "Only then + did + subject + V1."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Never have I heard such news.",
                "Never I have heard such news.",
                "Never heard I have such news.",
                "Never such news I have heard."
            ],
            answer: "Never have I heard such news.",
            explanation: "Never + auxiliary + subject + verb."
        },
        {
            type: "Concept",
            question: "Conditional inversion usually removes...",
            options: ["if", "subject", "verb", "object"],
            answer: "if",
            explanation: "Conditional inversion menghilangkan if."
        },
        {
            type: "Final",
            question: "Inversion is most common in...",
            options: [
                "formal and advanced English",
                "basic article usage",
                "plural noun spelling",
                "simple vocabulary lists"
            ],
            answer: "formal and advanced English",
            explanation: "Inversion sering digunakan dalam tulisan formal, akademik, dan grammar advanced."
        }
    ]
},

"subjunctive": {
    title: "Introduction to Subjunctive",
    description: "Subjunctive Mood adalah bentuk grammar yang digunakan untuk menyatakan saran, tuntutan, keinginan, kebutuhan, situasi imajinatif, atau kondisi yang bertentangan dengan kenyataan.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subjunctive = verb bentuk dasar untuk semua subject<br>
        Were Subjunctive = were untuk semua subject dalam situasi imajinatif
    `,

    notes: [
        "Subjunctive sering digunakan dalam bahasa formal.",
        "Subjunctive muncul setelah verb seperti suggest, recommend, demand, insist, request, propose.",
        "Dalam mandative subjunctive, verb menggunakan bentuk dasar/V1 untuk semua subject.",
        "Be tidak berubah menjadi is/am/are dalam mandative subjunctive.",
        "Were digunakan untuk semua subject dalam situasi imajinatif.",
        "Subjunctive sering muncul dalam struktur wish, if only, dan it is important that."
    ],

    patterns: [
        {
            group: "Mandative Subjunctive",
            items: [
                {
                    label: "Verb + That",
                    formula: "Subject + suggest/recommend/demand + that + Subject + V1",
                    examples: [
                        "The teacher suggested that he study harder.",
                        "They demanded that she be present.",
                        "I recommend that he take the test."
                    ]
                }
            ]
        },
        {
            group: "Were Subjunctive",
            items: [
                {
                    label: "Imaginary Situation",
                    formula: "If/Wish + Subject + were",
                    examples: [
                        "If I were you, I would apologize.",
                        "I wish I were taller.",
                        "If she were here, she would help us."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Subjunctive Mood is commonly used for...",
            options: ["suggestions and unreal situations", "articles only", "plural nouns", "countable nouns"],
            answer: "suggestions and unreal situations",
            explanation: "Subjunctive digunakan untuk saran, tuntutan, keinginan, dan situasi imajinatif."
        },
        {
            type: "Mandative",
            question: "The teacher suggested that he ___ harder.",
            options: ["study", "studies", "studied", "studying"],
            answer: "study",
            explanation: "Mandative subjunctive memakai V1 untuk semua subject."
        },
        {
            type: "Mandative",
            question: "They demanded that she ___ present.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Dalam mandative subjunctive, gunakan be, bukan is/am/are."
        },
        {
            type: "Mandative",
            question: "I recommend that he ___ the test.",
            options: ["take", "takes", "took", "taking"],
            answer: "take",
            explanation: "Setelah recommend that, gunakan V1."
        },
        {
            type: "Were",
            question: "If I ___ you, I would apologize.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Were subjunctive memakai were untuk semua subject."
        },
        {
            type: "Were",
            question: "I wish I ___ taller.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Wish untuk situasi sekarang yang tidak nyata memakai were."
        },
        {
            type: "Concept",
            question: "In mandative subjunctive, the verb form is...",
            options: ["base form / V1", "V2", "V3", "V-ing"],
            answer: "base form / V1",
            explanation: "Mandative subjunctive memakai verb bentuk dasar."
        },
        {
            type: "Concept",
            question: "Which sentence uses subjunctive correctly?",
            options: [
                "I suggest that she study harder.",
                "I suggest that she studies harder.",
                "I suggest that she studied harder.",
                "I suggest that she studying harder."
            ],
            answer: "I suggest that she study harder.",
            explanation: "Subjunctive memakai V1 tanpa -s."
        },
        {
            type: "Concept",
            question: "Were subjunctive is used for...",
            options: ["imaginary situations", "countable nouns", "articles", "quantity"],
            answer: "imaginary situations",
            explanation: "Were subjunctive digunakan untuk situasi tidak nyata atau imajinatif."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "If she were here, she would help us.",
                "If she is here, she would help us.",
                "If she be here, she would help us.",
                "If she are here, she would help us."
            ],
            answer: "If she were here, she would help us.",
            explanation: "Untuk situasi imajinatif, gunakan were."
        }
    ]
},

"mandative-subjunctive": {
    title: "Mandative Subjunctive",
    description: "Mandative Subjunctive digunakan setelah verb atau expression yang menyatakan saran, tuntutan, permintaan, keputusan, atau kebutuhan. Dalam struktur ini, verb selalu memakai bentuk dasar/V1 untuk semua subject.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Subject + suggest/recommend/demand/insist/request + that + Subject + V1
    `,

    notes: [
        "Mandative subjunctive banyak digunakan dalam bahasa formal.",
        "Verb setelah that memakai bentuk dasar/V1 untuk semua subject.",
        "He, she, dan it tidak memakai -s.",
        "Be tetap berbentuk be, bukan is/am/are.",
        "Verb umum: suggest, recommend, demand, insist, request, propose, require, order.",
        "Struktur ini sering muncul dalam academic writing dan formal English."
    ],

    patterns: [
        {
            group: "Suggestion / Recommendation",
            items: [
                {
                    label: "Suggest / Recommend",
                    formula: "suggest/recommend + that + subject + V1",
                    examples: [
                        "I suggest that he study harder.",
                        "The doctor recommended that she rest.",
                        "They suggested that we be careful."
                    ]
                }
            ]
        },
        {
            group: "Demand / Request",
            items: [
                {
                    label: "Demand / Request",
                    formula: "demand/request + that + subject + V1",
                    examples: [
                        "They demanded that he leave immediately.",
                        "She requested that the report be submitted today.",
                        "The manager demanded that everyone attend the meeting."
                    ]
                }
            ]
        },
        {
            group: "Requirement",
            items: [
                {
                    label: "Require / Insist / Order",
                    formula: "require/insist/order + that + subject + V1",
                    examples: [
                        "The school requires that every student wear a uniform.",
                        "He insisted that she be present.",
                        "The judge ordered that the evidence be reviewed."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Suggest",
            question: "I suggest that he ___ harder.",
            options: ["study", "studies", "studied", "studying"],
            answer: "study",
            explanation: "Mandative subjunctive memakai V1 untuk semua subject."
        },
        {
            type: "Recommend",
            question: "The doctor recommended that she ___.",
            options: ["rest", "rests", "rested", "resting"],
            answer: "rest",
            explanation: "Setelah recommended that, gunakan V1."
        },
        {
            type: "Be",
            question: "They suggested that we ___ careful.",
            options: ["be", "are", "were", "being"],
            answer: "be",
            explanation: "Dalam mandative subjunctive, gunakan be."
        },
        {
            type: "Demand",
            question: "They demanded that he ___ immediately.",
            options: ["leave", "leaves", "left", "leaving"],
            answer: "leave",
            explanation: "Demand that + subject + V1."
        },
        {
            type: "Request",
            question: "She requested that the report ___ submitted today.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Passive mandative subjunctive memakai be + V3."
        },
        {
            type: "Require",
            question: "The school requires that every student ___ a uniform.",
            options: ["wear", "wears", "wore", "wearing"],
            answer: "wear",
            explanation: "Every student tetap memakai V1 dalam subjunctive."
        },
        {
            type: "Insist",
            question: "He insisted that she ___ present.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Insist that + subject + be."
        },
        {
            type: "Order",
            question: "The judge ordered that the evidence ___ reviewed.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Passive subjunctive memakai be + V3."
        },
        {
            type: "Concept",
            question: "Mandative subjunctive uses...",
            options: ["base verb / V1", "V2", "V3 only", "V-ing only"],
            answer: "base verb / V1",
            explanation: "Verb selalu memakai bentuk dasar."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "I suggest that she study harder.",
                "I suggest that she studies harder.",
                "I suggest that she studied harder.",
                "I suggest that she studying harder."
            ],
            answer: "I suggest that she study harder.",
            explanation: "Subjunctive memakai V1 tanpa -s."
        }
    ]
},

"were-subjunctive": {
    title: "Were Subjunctive",
    description: "Were Subjunctive digunakan untuk situasi yang tidak nyata, imajinatif, atau bertentangan dengan fakta sekarang. Dalam struktur ini, were digunakan untuk semua subject, termasuk I, he, she, dan it.",

    formula: `
        <strong>Inti Materi:</strong><br>
        If + Subject + were, Subject + would + V1<br>
        Subject + wish + Subject + were
    `,

    notes: [
        "Were subjunctive digunakan untuk situasi imajinatif.",
        "Were digunakan untuk semua subject.",
        "If I were you adalah bentuk tetap yang sangat umum.",
        "Were subjunctive sering muncul dalam Second Conditional.",
        "Were juga digunakan setelah wish untuk keadaan sekarang yang tidak nyata.",
        "Dalam percakapan informal, was kadang dipakai, tetapi were lebih formal dan lebih tepat secara grammar."
    ],

    patterns: [
        {
            group: "If Clause",
            items: [
                {
                    label: "Imaginary Condition",
                    formula: "If + Subject + were, Subject + would + V1",
                    examples: [
                        "If I were you, I would apologize.",
                        "If she were here, she would help us.",
                        "If he were rich, he would travel around the world."
                    ]
                }
            ]
        },
        {
            group: "Wish",
            items: [
                {
                    label: "Unreal Present Wish",
                    formula: "Subject + wish + Subject + were",
                    examples: [
                        "I wish I were taller.",
                        "She wishes she were younger.",
                        "They wish they were at home."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "If Clause",
            question: "If I ___ you, I would apologize.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Were subjunctive memakai were untuk semua subject."
        },
        {
            type: "If Clause",
            question: "If she ___ here, she would help us.",
            options: ["is", "was", "were", "be"],
            answer: "were",
            explanation: "Untuk situasi imajinatif, gunakan were."
        },
        {
            type: "If Clause",
            question: "If he ___ rich, he would travel.",
            options: ["is", "was", "were", "be"],
            answer: "were",
            explanation: "Were digunakan untuk semua subject dalam subjunctive."
        },
        {
            type: "Wish",
            question: "I wish I ___ taller.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Wish untuk keadaan sekarang yang tidak nyata memakai were."
        },
        {
            type: "Wish",
            question: "She wishes she ___ younger.",
            options: ["is", "was", "were", "be"],
            answer: "were",
            explanation: "Were adalah bentuk formal untuk unreal wish."
        },
        {
            type: "Concept",
            question: "Were subjunctive is used for...",
            options: [
                "unreal or imaginary situations",
                "plural nouns only",
                "articles",
                "countable nouns"
            ],
            answer: "unreal or imaginary situations",
            explanation: "Were subjunctive digunakan untuk situasi tidak nyata."
        },
        {
            type: "Concept",
            question: "In were subjunctive, which subject can use were?",
            options: [
                "all subjects",
                "only they",
                "only we",
                "only plural nouns"
            ],
            answer: "all subjects",
            explanation: "Were dapat digunakan untuk I, he, she, it, we, they."
        },
        {
            type: "Error Check",
            question: "Which sentence is formally correct?",
            options: [
                "If I were you, I would accept it.",
                "If I am you, I would accept it.",
                "If I be you, I would accept it.",
                "If I is you, I would accept it."
            ],
            answer: "If I were you, I would accept it.",
            explanation: "If I were you adalah bentuk subjunctive yang benar."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "I wish she were here.",
                "I wish she is here.",
                "I wish she be here.",
                "I wish she are here."
            ],
            answer: "I wish she were here.",
            explanation: "Wish untuk situasi sekarang yang tidak nyata memakai were."
        },
        {
            type: "Meaning",
            question: "If she were here, she would help us. This means...",
            options: [
                "She is not here now.",
                "She is here now.",
                "She was here yesterday.",
                "She will definitely be here."
            ],
            answer: "She is not here now.",
            explanation: "Were subjunctive menunjukkan situasi yang tidak nyata sekarang."
        }
    ]
},

"wish-if-only": {
    title: "Wish & If Only",
    description: "Wish dan if only digunakan untuk menyatakan harapan, penyesalan, atau keinginan yang bertentangan dengan kenyataan. If only biasanya lebih kuat dan lebih emosional daripada wish.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Wish/If only + Simple Past = unreal present<br>
        Wish/If only + Past Perfect = regret about the past<br>
        Wish/If only + would + V1 = desire for change
    `,

    notes: [
        "Wish + Simple Past digunakan untuk keadaan sekarang yang tidak nyata.",
        "Wish + Past Perfect digunakan untuk penyesalan masa lampau.",
        "Wish + would digunakan ketika ingin seseorang/sesuatu berubah.",
        "If only memiliki makna lebih kuat daripada wish.",
        "Untuk be verb dalam unreal present, were lebih formal daripada was.",
        "Wish tidak sama dengan hope. Hope digunakan untuk kemungkinan nyata."
    ],

    patterns: [
        {
            group: "Unreal Present",
            items: [
                {
                    label: "Wish + Simple Past",
                    formula: "Subject + wish + Subject + Simple Past",
                    examples: [
                        "I wish I had more time.",
                        "She wishes she lived near the beach.",
                        "I wish I were taller."
                    ]
                },
                {
                    label: "If Only + Simple Past",
                    formula: "If only + Subject + Simple Past",
                    examples: [
                        "If only I had more money.",
                        "If only he understood me.",
                        "If only she were here."
                    ]
                }
            ]
        },
        {
            group: "Past Regret",
            items: [
                {
                    label: "Wish + Past Perfect",
                    formula: "Subject + wish + Subject + had + V3",
                    examples: [
                        "I wish I had studied harder.",
                        "She wishes she had taken the job.",
                        "They wish they had arrived earlier."
                    ]
                },
                {
                    label: "If Only + Past Perfect",
                    formula: "If only + Subject + had + V3",
                    examples: [
                        "If only I had listened to you.",
                        "If only he had told the truth.",
                        "If only we had left earlier."
                    ]
                }
            ]
        },
        {
            group: "Desire for Change",
            items: [
                {
                    label: "Wish + Would",
                    formula: "Subject + wish + Subject + would + V1",
                    examples: [
                        "I wish he would stop talking.",
                        "She wishes it would stop raining.",
                        "They wish the neighbors would be quieter."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Unreal Present",
            question: "I wish I ___ more time.",
            options: ["have", "had", "will have", "have had"],
            answer: "had",
            explanation: "Wish untuk keadaan sekarang yang tidak nyata memakai Simple Past."
        },
        {
            type: "Unreal Present",
            question: "She wishes she ___ near the beach.",
            options: ["lives", "lived", "will live", "has lived"],
            answer: "lived",
            explanation: "Wish + Simple Past menunjukkan keadaan sekarang yang tidak nyata."
        },
        {
            type: "Were",
            question: "I wish I ___ taller.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Untuk be verb dalam unreal present, were lebih formal."
        },
        {
            type: "If Only",
            question: "If only she ___ here.",
            options: ["is", "was", "were", "be"],
            answer: "were",
            explanation: "If only + Simple Past/Were menunjukkan harapan yang tidak nyata."
        },
        {
            type: "Past Regret",
            question: "I wish I ___ harder.",
            options: ["study", "studied", "had studied", "will study"],
            answer: "had studied",
            explanation: "Wish untuk penyesalan masa lampau memakai Past Perfect."
        },
        {
            type: "Past Regret",
            question: "She wishes she ___ the job.",
            options: ["takes", "took", "had taken", "will take"],
            answer: "had taken",
            explanation: "Had taken menunjukkan penyesalan terhadap masa lampau."
        },
        {
            type: "Would",
            question: "I wish he ___ stop talking.",
            options: ["will", "would", "had", "was"],
            answer: "would",
            explanation: "Wish + would digunakan untuk keinginan agar sesuatu berubah."
        },
        {
            type: "Would",
            question: "She wishes it ___ stop raining.",
            options: ["would", "will", "had", "were"],
            answer: "would",
            explanation: "Wish + would menunjukkan harapan terhadap perubahan situasi."
        },
        {
            type: "Concept",
            question: "If only is usually...",
            options: [
                "stronger than wish",
                "weaker than articles",
                "only used for nouns",
                "only used for passive voice"
            ],
            answer: "stronger than wish",
            explanation: "If only lebih emosional dan kuat daripada wish."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "I wish I had studied harder.",
                "I wish I have studied harder.",
                "I wish I will study harder.",
                "I wish I study harder yesterday."
            ],
            answer: "I wish I had studied harder.",
            explanation: "Penyesalan masa lampau memakai wish + Past Perfect."
        }
    ]
},

"important-that": {
    title: "It Is Important That",
    description: "Struktur 'It is important that' digunakan untuk menyatakan kebutuhan, saran, urgensi, atau kewajiban secara formal. Setelah adjective tertentu, verb dalam that-clause memakai bentuk dasar/V1 untuk semua subject.",

    formula: `
        <strong>Inti Materi:</strong><br>
        It is + adjective + that + Subject + V1
    `,

    notes: [
        "Struktur ini termasuk subjunctive.",
        "Verb dalam that-clause memakai bentuk dasar/V1.",
        "He, she, dan it tidak memakai -s.",
        "Be tetap berbentuk be, bukan is/am/are.",
        "Adjective umum: important, essential, necessary, vital, crucial, urgent, advisable.",
        "Struktur ini sering digunakan dalam formal English dan academic writing."
    ],

    patterns: [
        {
            group: "Importance",
            items: [
                {
                    label: "Important / Essential",
                    formula: "It is important/essential that + subject + V1",
                    examples: [
                        "It is important that he study harder.",
                        "It is essential that she be present.",
                        "It is important that every student follow the rules."
                    ]
                }
            ]
        },
        {
            group: "Necessity",
            items: [
                {
                    label: "Necessary / Vital",
                    formula: "It is necessary/vital that + subject + V1",
                    examples: [
                        "It is necessary that he arrive on time.",
                        "It is vital that the report be completed today.",
                        "It is necessary that everyone understand the instructions."
                    ]
                }
            ]
        },
        {
            group: "Advice / Urgency",
            items: [
                {
                    label: "Advisable / Urgent",
                    formula: "It is advisable/urgent that + subject + V1",
                    examples: [
                        "It is advisable that she consult a doctor.",
                        "It is urgent that the documents be submitted.",
                        "It is advisable that he take a short break."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Important",
            question: "It is important that he ___ harder.",
            options: ["study", "studies", "studied", "studying"],
            answer: "study",
            explanation: "Setelah It is important that, gunakan V1."
        },
        {
            type: "Essential",
            question: "It is essential that she ___ present.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Subjunctive memakai be, bukan is/am/are."
        },
        {
            type: "Necessary",
            question: "It is necessary that he ___ on time.",
            options: ["arrive", "arrives", "arrived", "arriving"],
            answer: "arrive",
            explanation: "He tidak memakai -s dalam subjunctive."
        },
        {
            type: "Vital",
            question: "It is vital that the report ___ completed today.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Passive subjunctive memakai be + V3."
        },
        {
            type: "Advisable",
            question: "It is advisable that she ___ a doctor.",
            options: ["consult", "consults", "consulted", "consulting"],
            answer: "consult",
            explanation: "Gunakan V1 untuk semua subject."
        },
        {
            type: "Urgent",
            question: "It is urgent that the documents ___ submitted.",
            options: ["be", "are", "were", "being"],
            answer: "be",
            explanation: "Passive form dalam subjunctive adalah be + V3."
        },
        {
            type: "Concept",
            question: "After 'It is important that', the verb usually uses...",
            options: ["base form / V1", "V2", "V3 only", "V-ing"],
            answer: "base form / V1",
            explanation: "Struktur ini memakai subjunctive verb."
        },
        {
            type: "Concept",
            question: "Which adjective commonly triggers subjunctive?",
            options: ["essential", "blue", "quickly", "under"],
            answer: "essential",
            explanation: "Essential termasuk adjective yang sering memicu subjunctive."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "It is important that she be present.",
                "It is important that she is present.",
                "It is important that she was present.",
                "It is important that she being present."
            ],
            answer: "It is important that she be present.",
            explanation: "Subjunctive memakai be."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "It is necessary that every student follow the rules.",
                "It is necessary that every student follows the rules.",
                "It is necessary that every student followed the rules.",
                "It is necessary that every student following the rules."
            ],
            answer: "It is necessary that every student follow the rules.",
            explanation: "Every student tetap memakai V1 dalam subjunctive."
        }
    ]
},

"subjunctive-review": {
    title: "Subjunctive Review",
    description: "Review akhir untuk menguji seluruh materi Subjunctive Mood: mandative subjunctive, were subjunctive, wish, if only, dan struktur it is important that.",

    formula: `
        <strong>Ringkasan BAB 13:</strong><br>
        Mandative = suggest/recommend/demand + that + Subject + V1<br>
        Were Subjunctive = If/Wish + Subject + were<br>
        Wish Present = wish + Simple Past<br>
        Wish Past Regret = wish + Past Perfect<br>
        Important That = It is important that + Subject + V1
    `,

    notes: [
        "Mandative subjunctive memakai V1 untuk semua subject.",
        "Be tetap berbentuk be, bukan is/am/are.",
        "Were digunakan untuk semua subject dalam situasi imajinatif.",
        "Wish + Simple Past digunakan untuk keadaan sekarang yang tidak nyata.",
        "Wish + Past Perfect digunakan untuk penyesalan masa lampau.",
        "Wish + would digunakan untuk keinginan agar situasi berubah.",
        "It is important/essential/necessary that memakai subjunctive V1."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Mandative",
                    formula: "verb + that + subject + V1",
                    examples: [
                        "I suggest that he study harder.",
                        "They demanded that she be present.",
                        "The doctor recommended that he rest."
                    ]
                },
                {
                    label: "Were / Wish",
                    formula: "If/Wish + subject + were",
                    examples: [
                        "If I were you, I would apologize.",
                        "I wish I were taller.",
                        "If she were here, she would help us."
                    ]
                },
                {
                    label: "Important That",
                    formula: "It is + adjective + that + subject + V1",
                    examples: [
                        "It is important that he study.",
                        "It is essential that she be present.",
                        "It is necessary that every student follow the rules."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Mandative",
            question: "I suggest that he ___ harder.",
            options: ["study", "studies", "studied", "studying"],
            answer: "study",
            explanation: "Mandative subjunctive memakai V1 untuk semua subject."
        },
        {
            type: "Mandative",
            question: "The doctor recommended that she ___.",
            options: ["rest", "rests", "rested", "resting"],
            answer: "rest",
            explanation: "Recommended that + subject + V1."
        },
        {
            type: "Mandative Be",
            question: "They demanded that she ___ present.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Subjunctive memakai be, bukan is."
        },
        {
            type: "Passive Subjunctive",
            question: "She requested that the report ___ submitted today.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Passive subjunctive memakai be + V3."
        },
        {
            type: "Were",
            question: "If I ___ you, I would accept it.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Were digunakan untuk semua subject dalam situasi imajinatif."
        },
        {
            type: "Were",
            question: "If she ___ here, she would help us.",
            options: ["is", "was", "were", "be"],
            answer: "were",
            explanation: "Were subjunctive menunjukkan situasi tidak nyata."
        },
        {
            type: "Wish Present",
            question: "I wish I ___ more time.",
            options: ["have", "had", "will have", "have had"],
            answer: "had",
            explanation: "Wish untuk keadaan sekarang yang tidak nyata memakai Simple Past."
        },
        {
            type: "Wish Present",
            question: "I wish I ___ taller.",
            options: ["am", "was", "were", "be"],
            answer: "were",
            explanation: "Untuk be verb, were lebih formal dan tepat."
        },
        {
            type: "Wish Past",
            question: "I wish I ___ harder.",
            options: ["study", "studied", "had studied", "will study"],
            answer: "had studied",
            explanation: "Penyesalan masa lampau memakai wish + Past Perfect."
        },
        {
            type: "Wish Past",
            question: "She wishes she ___ the job.",
            options: ["takes", "took", "had taken", "will take"],
            answer: "had taken",
            explanation: "Had taken menunjukkan penyesalan terhadap masa lampau."
        },
        {
            type: "Wish Would",
            question: "I wish he ___ stop talking.",
            options: ["will", "would", "had", "was"],
            answer: "would",
            explanation: "Wish + would digunakan untuk keinginan agar situasi berubah."
        },
        {
            type: "If Only",
            question: "If only she ___ here.",
            options: ["is", "was", "were", "be"],
            answer: "were",
            explanation: "If only + were menunjukkan harapan yang tidak nyata."
        },
        {
            type: "Important",
            question: "It is important that he ___ harder.",
            options: ["study", "studies", "studied", "studying"],
            answer: "study",
            explanation: "It is important that memakai subjunctive V1."
        },
        {
            type: "Essential",
            question: "It is essential that she ___ present.",
            options: ["be", "is", "was", "being"],
            answer: "be",
            explanation: "Subjunctive memakai be."
        },
        {
            type: "Necessary",
            question: "It is necessary that every student ___ the rules.",
            options: ["follow", "follows", "followed", "following"],
            answer: "follow",
            explanation: "Every student tetap memakai V1 dalam subjunctive."
        },
        {
            type: "Concept",
            question: "Mandative subjunctive uses...",
            options: ["base verb / V1", "V2", "V3 only", "V-ing"],
            answer: "base verb / V1",
            explanation: "Mandative subjunctive selalu memakai verb bentuk dasar."
        },
        {
            type: "Concept",
            question: "Were subjunctive is used for...",
            options: ["unreal situations", "articles", "plural nouns only", "countable nouns"],
            answer: "unreal situations",
            explanation: "Were subjunctive digunakan untuk situasi imajinatif atau tidak nyata."
        },
        {
            type: "Concept",
            question: "Wish + Past Perfect expresses...",
            options: ["past regret", "future certainty", "present habit", "article usage"],
            answer: "past regret",
            explanation: "Wish + Past Perfect menunjukkan penyesalan masa lampau."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "I suggest that she study harder.",
                "I suggest that she studies harder.",
                "I suggest that she studied harder.",
                "I suggest that she studying harder."
            ],
            answer: "I suggest that she study harder.",
            explanation: "Subjunctive memakai V1 tanpa -s."
        },
        {
            type: "Final",
            question: "Which sentence uses subjunctive correctly?",
            options: [
                "It is vital that the report be completed today.",
                "It is vital that the report is completed today.",
                "It is vital that the report was completed today.",
                "It is vital that the report being completed today."
            ],
            answer: "It is vital that the report be completed today.",
            explanation: "Passive subjunctive memakai be + V3."
        }
    ]
},

"punctuation": {
    title: "Introduction to Punctuation",
    description: "Punctuation adalah tanda baca yang membantu pembaca memahami struktur, jeda, hubungan ide, dan emosi dalam kalimat. Tanda baca yang tepat membuat tulisan lebih jelas, rapi, dan profesional.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Punctuation = tanda baca untuk mengatur makna dan struktur kalimat
    `,

    notes: [
        "Period digunakan untuk mengakhiri statement.",
        "Question mark digunakan untuk pertanyaan langsung.",
        "Exclamation mark digunakan untuk emosi kuat.",
        "Comma digunakan untuk jeda, daftar, clause awal, dan tambahan informasi.",
        "Colon digunakan untuk memperkenalkan daftar atau penjelasan.",
        "Semicolon menghubungkan dua independent clauses yang berkaitan.",
        "Apostrophe digunakan untuk kepemilikan atau contraction.",
        "Quotation marks digunakan untuk kutipan langsung."
    ],

    patterns: [
        {
            group: "End Punctuation",
            items: [
                {
                    label: "Period / Question / Exclamation",
                    formula: "Sentence + . / ? / !",
                    examples: [
                        "She is a student.",
                        "Are you ready?",
                        "What a beautiful day!"
                    ]
                }
            ]
        },
        {
            group: "Internal Punctuation",
            items: [
                {
                    label: "Comma / Colon / Semicolon",
                    formula: "Punctuation inside a sentence",
                    examples: [
                        "After class, we went home.",
                        "I need three things: time, money, and support.",
                        "She studied hard; she passed the exam."
                    ]
                }
            ]
        },
        {
            group: "Special Marks",
            items: [
                {
                    label: "Apostrophe / Quotation Marks",
                    formula: "Possession, contraction, and direct speech",
                    examples: [
                        "Rina's book is on the table.",
                        "I don't know the answer.",
                        "He said, \"I am ready.\""
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Period",
            question: "Which punctuation ends a normal statement?",
            options: ["Period", "Question mark", "Exclamation mark", "Comma"],
            answer: "Period",
            explanation: "Statement biasa diakhiri dengan period."
        },
        {
            type: "Question",
            question: "Which punctuation ends a direct question?",
            options: ["Question mark", "Period", "Comma", "Colon"],
            answer: "Question mark",
            explanation: "Pertanyaan langsung memakai question mark."
        },
        {
            type: "Exclamation",
            question: "Which punctuation shows strong emotion?",
            options: ["Exclamation mark", "Period", "Semicolon", "Apostrophe"],
            answer: "Exclamation mark",
            explanation: "Exclamation mark menunjukkan emosi kuat."
        },
        {
            type: "Comma",
            question: "Which sentence uses comma correctly?",
            options: [
                "After class, we went home.",
                "After, class we went home.",
                "After class we, went home.",
                "After class we went, home."
            ],
            answer: "After class, we went home.",
            explanation: "Introductory phrase di awal biasanya diikuti comma."
        },
        {
            type: "Colon",
            question: "Which punctuation introduces a list?",
            options: ["Colon", "Question mark", "Apostrophe", "Period"],
            answer: "Colon",
            explanation: "Colon dapat digunakan untuk memperkenalkan daftar."
        },
        {
            type: "Semicolon",
            question: "Which punctuation can connect two related independent clauses?",
            options: ["Semicolon", "Apostrophe", "Question mark", "Quotation marks"],
            answer: "Semicolon",
            explanation: "Semicolon dapat menghubungkan dua independent clauses yang berkaitan."
        },
        {
            type: "Apostrophe",
            question: "Which punctuation shows possession?",
            options: ["Apostrophe", "Comma", "Colon", "Period"],
            answer: "Apostrophe",
            explanation: "Apostrophe digunakan untuk kepemilikan, seperti Rina's book."
        },
        {
            type: "Quotation",
            question: "Which punctuation is used for direct speech?",
            options: ["Quotation marks", "Colon only", "Semicolon", "Apostrophe only"],
            answer: "Quotation marks",
            explanation: "Direct speech memakai quotation marks."
        },
        {
            type: "Concept",
            question: "Punctuation helps readers understand...",
            options: ["sentence structure and meaning", "noun gender only", "plural spelling only", "verb color"],
            answer: "sentence structure and meaning",
            explanation: "Tanda baca membantu struktur dan makna kalimat."
        },
        {
            type: "Error Check",
            question: "Which sentence is correctly punctuated?",
            options: [
                "He said, \"I am ready.\"",
                "He said \"I am ready.",
                "He said, I am ready.\"",
                "He said \"I am ready"
            ],
            answer: "He said, \"I am ready.\"",
            explanation: "Kutipan langsung memakai comma dan quotation marks."
        }
    ]
},

"comma-rules": {
    title: "Comma Rules",
    description: "Comma digunakan untuk memberi jeda, memisahkan elemen dalam daftar, memisahkan introductory phrase, menghubungkan independent clauses dengan conjunction, dan menandai informasi tambahan.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Comma = tanda baca untuk jeda dan pemisahan struktur kalimat
    `,

    notes: [
        "Gunakan comma setelah introductory phrase atau clause.",
        "Gunakan comma untuk memisahkan item dalam daftar.",
        "Gunakan comma sebelum coordinating conjunction yang menghubungkan dua independent clauses.",
        "Gunakan comma untuk non-defining clause.",
        "Gunakan comma setelah direct address.",
        "Jangan gunakan comma untuk memisahkan subject dan verb."
    ],

    patterns: [
        {
            group: "Introductory Element",
            items: [
                {
                    label: "After Intro",
                    formula: "Introductory phrase/clause, main clause",
                    examples: [
                        "After school, we went home.",
                        "When I arrived, she was sleeping.",
                        "Because it was raining, we stayed inside."
                    ]
                }
            ]
        },
        {
            group: "List",
            items: [
                {
                    label: "Series",
                    formula: "item 1, item 2, and item 3",
                    examples: [
                        "I bought apples, oranges, and bananas.",
                        "She likes reading, writing, and drawing.",
                        "We need time, money, and support."
                    ]
                }
            ]
        },
        {
            group: "Compound Sentence",
            items: [
                {
                    label: "Before FANBOYS",
                    formula: "Independent clause, FANBOYS independent clause",
                    examples: [
                        "I wanted to go, but I was tired.",
                        "She studied hard, so she passed.",
                        "He called me, and I answered."
                    ]
                }
            ]
        },
        {
            group: "Extra Information",
            items: [
                {
                    label: "Non-Defining",
                    formula: "noun, extra information, main clause",
                    examples: [
                        "My brother, who lives in London, is a doctor.",
                        "Jakarta, the capital of Indonesia, is crowded.",
                        "My car, which is old, still works."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Intro",
            question: "Which sentence uses comma correctly?",
            options: [
                "After school, we went home.",
                "After, school we went home.",
                "After school we, went home.",
                "After school we went, home."
            ],
            answer: "After school, we went home.",
            explanation: "Introductory phrase di awal diikuti comma."
        },
        {
            type: "Adverb Clause",
            question: "Which sentence is correct?",
            options: [
                "When I arrived, she was sleeping.",
                "When, I arrived she was sleeping.",
                "When I, arrived she was sleeping.",
                "When I arrived she, was sleeping."
            ],
            answer: "When I arrived, she was sleeping.",
            explanation: "Adverb clause di awal diikuti comma."
        },
        {
            type: "List",
            question: "Which sentence uses commas correctly?",
            options: [
                "I bought apples, oranges, and bananas.",
                "I bought apples oranges, and bananas.",
                "I bought apples, oranges and, bananas.",
                "I bought, apples oranges and bananas."
            ],
            answer: "I bought apples, oranges, and bananas.",
            explanation: "Comma digunakan untuk memisahkan item dalam daftar."
        },
        {
            type: "FANBOYS",
            question: "Which sentence is correct?",
            options: [
                "I wanted to go, but I was tired.",
                "I wanted, to go but I was tired.",
                "I wanted to go but, I was tired.",
                "I, wanted to go but I was tired."
            ],
            answer: "I wanted to go, but I was tired.",
            explanation: "Gunakan comma sebelum but jika menghubungkan dua independent clauses."
        },
        {
            type: "Result",
            question: "She studied hard, ___ she passed.",
            options: ["so", "because", "although", "unless"],
            answer: "so",
            explanation: "Comma + so dapat menghubungkan dua independent clauses."
        },
        {
            type: "Non-Defining",
            question: "Which sentence uses commas correctly?",
            options: [
                "My brother, who lives in London, is a doctor.",
                "My brother who, lives in London is a doctor.",
                "My brother who lives, in London is a doctor.",
                "My brother who lives in London, is a doctor."
            ],
            answer: "My brother, who lives in London, is a doctor.",
            explanation: "Non-defining clause dipisahkan dengan commas."
        },
        {
            type: "Direct Address",
            question: "Which sentence is correct?",
            options: [
                "Rina, please close the door.",
                "Rina please, close the door.",
                "Rina please close, the door.",
                "Rina please close the, door."
            ],
            answer: "Rina, please close the door.",
            explanation: "Direct address dipisahkan dengan comma."
        },
        {
            type: "Error Check",
            question: "Which sentence is incorrect?",
            options: [
                "The student, passed the exam.",
                "After class, we went home.",
                "I like tea, coffee, and milk.",
                "She studied hard, so she passed."
            ],
            answer: "The student, passed the exam.",
            explanation: "Jangan pisahkan subject dan verb dengan comma."
        },
        {
            type: "Concept",
            question: "Comma should NOT separate...",
            options: [
                "subject and verb",
                "items in a list",
                "introductory phrase and main clause",
                "non-defining clause"
            ],
            answer: "subject and verb",
            explanation: "Subject dan verb tidak boleh dipisahkan comma."
        },
        {
            type: "Concept",
            question: "FANBOYS includes...",
            options: [
                "for, and, nor, but, or, yet, so",
                "because, although, when",
                "who, which, that",
                "a, an, the"
            ],
            answer: "for, and, nor, but, or, yet, so",
            explanation: "FANBOYS adalah coordinating conjunctions."
        }
    ]
},

"end-punctuation": {
    title: "Period, Question Mark & Exclamation",
    description: "End punctuation adalah tanda baca yang digunakan untuk mengakhiri kalimat. Tiga tanda utama adalah period, question mark, dan exclamation mark.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Statement → Period (.)<br>
        Direct Question → Question Mark (?)<br>
        Strong Emotion → Exclamation Mark (!)
    `,

    notes: [
        "Period digunakan untuk statement atau kalimat berita.",
        "Question mark digunakan untuk direct question.",
        "Exclamation mark digunakan untuk emosi kuat, perintah kuat, atau ekspresi terkejut.",
        "Indirect question biasanya memakai period, bukan question mark.",
        "Jangan terlalu sering memakai exclamation mark dalam tulisan formal.",
        "Satu kalimat hanya membutuhkan satu end punctuation."
    ],

    patterns: [
        {
            group: "Period",
            items: [
                {
                    label: "Statement",
                    formula: "Sentence + .",
                    examples: [
                        "She is a student.",
                        "I live in Indonesia.",
                        "The meeting starts at 9 a.m."
                    ]
                },
                {
                    label: "Indirect Question",
                    formula: "Statement with question meaning + .",
                    examples: [
                        "I wonder where he lives.",
                        "She asked if I was ready.",
                        "He wanted to know what happened."
                    ]
                }
            ]
        },
        {
            group: "Question Mark",
            items: [
                {
                    label: "Direct Question",
                    formula: "Question + ?",
                    examples: [
                        "Are you ready?",
                        "Where do you live?",
                        "Did she call you?"
                    ]
                }
            ]
        },
        {
            group: "Exclamation Mark",
            items: [
                {
                    label: "Strong Emotion",
                    formula: "Expression + !",
                    examples: [
                        "What a beautiful day!",
                        "Watch out!",
                        "That is amazing!"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Period",
            question: "Choose the correct punctuation: She is a student___",
            options: [".", "?", "!", ","],
            answer: ".",
            explanation: "Statement biasa diakhiri period."
        },
        {
            type: "Question",
            question: "Choose the correct punctuation: Are you ready___",
            options: ["?", ".", "!", ","],
            answer: "?",
            explanation: "Direct question diakhiri question mark."
        },
        {
            type: "Exclamation",
            question: "Choose the correct punctuation: Watch out___",
            options: ["!", ".", "?", ","],
            answer: "!",
            explanation: "Watch out menunjukkan peringatan kuat."
        },
        {
            type: "Question",
            question: "Which sentence is a direct question?",
            options: [
                "Where do you live?",
                "I know where you live.",
                "She asked where I lived.",
                "He knows the answer."
            ],
            answer: "Where do you live?",
            explanation: "Direct question memakai question mark."
        },
        {
            type: "Indirect Question",
            question: "Which sentence is punctuated correctly?",
            options: [
                "I wonder where he lives.",
                "I wonder where he lives?",
                "I wonder where does he live?",
                "I wonder where does he live."
            ],
            answer: "I wonder where he lives.",
            explanation: "Indirect question berbentuk statement, jadi memakai period."
        },
        {
            type: "Reported Question",
            question: "Which sentence is correct?",
            options: [
                "She asked if I was ready.",
                "She asked if I was ready?",
                "She asked was I ready?",
                "She asked if was I ready?"
            ],
            answer: "She asked if I was ready.",
            explanation: "Reported question memakai statement order dan period."
        },
        {
            type: "Formal Writing",
            question: "In formal writing, exclamation marks should be used...",
            options: [
                "sparingly",
                "after every sentence",
                "instead of commas",
                "before every noun"
            ],
            answer: "sparingly",
            explanation: "Exclamation mark sebaiknya tidak berlebihan dalam tulisan formal."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "What a beautiful day!",
                "What a beautiful day?.",
                "What a beautiful day,",
                "What a beautiful day??"
            ],
            answer: "What a beautiful day!",
            explanation: "Ekspresi kuat memakai exclamation mark."
        },
        {
            type: "Concept",
            question: "Question mark is used for...",
            options: [
                "direct questions",
                "normal statements",
                "noun phrases",
                "possessive nouns"
            ],
            answer: "direct questions",
            explanation: "Question mark digunakan untuk direct question."
        },
        {
            type: "Concept",
            question: "Period is used for...",
            options: [
                "statements",
                "direct questions only",
                "strong emotions only",
                "lists only"
            ],
            answer: "statements",
            explanation: "Period digunakan untuk mengakhiri statement."
        }
    ]
},

"colon-semicolon": {
    title: "Colon & Semicolon",
    description: "Colon dan semicolon digunakan untuk menghubungkan ide dalam kalimat. Colon biasanya memperkenalkan daftar, penjelasan, atau contoh. Semicolon menghubungkan dua independent clauses yang sangat berkaitan.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Colon = introduce list / explanation / example<br>
        Semicolon = connect related independent clauses
    `,

    notes: [
        "Colon digunakan sebelum daftar.",
        "Colon digunakan sebelum penjelasan atau contoh.",
        "Semicolon digunakan untuk menghubungkan dua independent clauses yang berhubungan erat.",
        "Semicolon lebih kuat daripada comma tetapi lebih lemah daripada period.",
        "Jangan gunakan colon setelah verb langsung jika list menjadi object verb.",
        "Jangan gunakan semicolon untuk menghubungkan dependent clause."
    ],

    patterns: [
        {
            group: "Colon",
            items: [
                {
                    label: "List",
                    formula: "Complete sentence + : + list",
                    examples: [
                        "I need three things: time, money, and support.",
                        "She bought several items: books, pens, and paper.",
                        "We visited three cities: London, Paris, and Rome."
                    ]
                },
                {
                    label: "Explanation",
                    formula: "Complete sentence + : + explanation",
                    examples: [
                        "He had one goal: to win the competition.",
                        "The reason is simple: we were not ready.",
                        "She made one mistake: she trusted the wrong person."
                    ]
                }
            ]
        },
        {
            group: "Semicolon",
            items: [
                {
                    label: "Related Independent Clauses",
                    formula: "Independent clause ; independent clause",
                    examples: [
                        "She studied hard; she passed the exam.",
                        "The rain was heavy; the match was canceled.",
                        "He was tired; he continued working."
                    ]
                },
                {
                    label: "With Transition",
                    formula: "Independent clause ; however/therefore/moreover, independent clause",
                    examples: [
                        "She was tired; however, she kept studying.",
                        "The data was incomplete; therefore, the report was delayed.",
                        "He is very talented; moreover, he works hard."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Colon",
            question: "I need three things___ time, money, and support.",
            options: [":", ";", ".", "?"],
            answer: ":",
            explanation: "Colon digunakan untuk memperkenalkan daftar."
        },
        {
            type: "Colon",
            question: "He had one goal___ to win the competition.",
            options: [":", ";", ",", "?"],
            answer: ":",
            explanation: "Colon dapat memperkenalkan penjelasan."
        },
        {
            type: "Semicolon",
            question: "She studied hard___ she passed the exam.",
            options: [";", ":", "?", "!"],
            answer: ";",
            explanation: "Semicolon menghubungkan dua independent clauses yang berkaitan."
        },
        {
            type: "Semicolon",
            question: "The rain was heavy___ the match was canceled.",
            options: [";", ":", "?", "!"],
            answer: ";",
            explanation: "Kedua clause adalah independent dan berhubungan erat."
        },
        {
            type: "Transition",
            question: "She was tired___ however, she kept studying.",
            options: [";", ":", "?", "!"],
            answer: ";",
            explanation: "Gunakan semicolon sebelum transition seperti however."
        },
        {
            type: "Transition",
            question: "The data was incomplete___ therefore, the report was delayed.",
            options: [";", ":", ",", "?"],
            answer: ";",
            explanation: "Semicolon dapat digunakan sebelum therefore ketika menghubungkan dua independent clauses."
        },
        {
            type: "Concept",
            question: "Colon is commonly used to introduce...",
            options: ["a list or explanation", "a direct question", "a possessive noun", "a plural noun"],
            answer: "a list or explanation",
            explanation: "Colon memperkenalkan daftar, penjelasan, atau contoh."
        },
        {
            type: "Concept",
            question: "Semicolon connects...",
            options: [
                "two related independent clauses",
                "subject and verb only",
                "article and noun",
                "adjective and adverb only"
            ],
            answer: "two related independent clauses",
            explanation: "Semicolon menghubungkan dua independent clauses."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "I need three things: time, money, and support.",
                "I need: time, money, and support.",
                "I need three things; time, money, and support.",
                "I need three things? time, money, and support."
            ],
            answer: "I need three things: time, money, and support.",
            explanation: "Colon digunakan setelah complete sentence sebelum list."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She studied hard; she passed the exam.",
                "She studied hard; because she passed the exam.",
                "She studied hard: she passed the exam?",
                "She studied hard, she passed the exam."
            ],
            answer: "She studied hard; she passed the exam.",
            explanation: "Semicolon benar karena kedua bagian adalah independent clauses."
        }
    ]
},

"apostrophe-quotation": {
    title: "Apostrophe & Quotation Marks",
    description: "Apostrophe digunakan untuk menunjukkan kepemilikan atau contraction. Quotation marks digunakan untuk menandai kutipan langsung atau judul pendek seperti artikel, lagu, dan cerita pendek.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Possession = noun + 's<br>
        Contraction = shortened form<br>
        Direct Speech = "quoted words"
    `,

    notes: [
        "Apostrophe + s digunakan untuk kepemilikan singular.",
        "Untuk plural noun berakhiran -s, apostrophe diletakkan setelah s.",
        "Contraction menggabungkan dua kata, seperti do not menjadi don't.",
        "Its tanpa apostrophe menunjukkan kepemilikan.",
        "It's dengan apostrophe berarti it is atau it has.",
        "Quotation marks digunakan untuk direct speech.",
        "Comma biasanya diletakkan sebelum quotation marks dalam direct speech."
    ],

    patterns: [
        {
            group: "Apostrophe",
            items: [
                {
                    label: "Possession",
                    formula: "noun + 's / plural noun + '",
                    examples: [
                        "Rina's book is on the table.",
                        "The teacher's bag is black.",
                        "The students' classroom is clean."
                    ]
                },
                {
                    label: "Contraction",
                    formula: "shortened form",
                    examples: [
                        "do not → don't",
                        "it is → it's",
                        "they are → they're"
                    ]
                }
            ]
        },
        {
            group: "Quotation Marks",
            items: [
                {
                    label: "Direct Speech",
                    formula: "Subject + said, \"sentence\"",
                    examples: [
                        "He said, \"I am ready.\"",
                        "She asked, \"Are you okay?\"",
                        "They shouted, \"We won!\""
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Possession",
            question: "Choose the correct phrase.",
            options: ["Rina's book", "Rinas book", "Rina book's", "Rinas' book"],
            answer: "Rina's book",
            explanation: "Singular possession memakai noun + 's."
        },
        {
            type: "Plural Possession",
            question: "Choose the correct phrase.",
            options: ["the students' classroom", "the student's classroom", "the students classroom", "the student classroom's"],
            answer: "the students' classroom",
            explanation: "Plural noun berakhiran -s memakai apostrophe setelah s."
        },
        {
            type: "Contraction",
            question: "Don't means...",
            options: ["do not", "does not", "did not", "do it"],
            answer: "do not",
            explanation: "Don't adalah contraction dari do not."
        },
        {
            type: "Its/It's",
            question: "___ raining outside.",
            options: ["It's", "Its", "Its'", "It"],
            answer: "It's",
            explanation: "It's berarti it is."
        },
        {
            type: "Its/It's",
            question: "The cat licked ___ paw.",
            options: ["its", "it's", "its'", "it"],
            answer: "its",
            explanation: "Its tanpa apostrophe menunjukkan kepemilikan."
        },
        {
            type: "Quotation",
            question: "Which sentence uses quotation marks correctly?",
            options: [
                "He said, \"I am ready.\"",
                "He said, I am ready.\"",
                "He said \"I am ready.",
                "\"He said, I am ready."
            ],
            answer: "He said, \"I am ready.\"",
            explanation: "Direct speech memakai comma dan quotation marks."
        },
        {
            type: "Question Quote",
            question: "Which sentence is correct?",
            options: [
                "She asked, \"Are you okay?\"",
                "She asked, \"Are you okay.\"",
                "She asked \"Are you okay\"?",
                "She asked, Are you okay?"
            ],
            answer: "She asked, \"Are you okay?\"",
            explanation: "Question mark berada di dalam quotation marks jika bagian kutipan adalah pertanyaan."
        },
        {
            type: "Concept",
            question: "Apostrophe is used for...",
            options: ["possession and contraction", "direct questions only", "lists only", "adverb clauses"],
            answer: "possession and contraction",
            explanation: "Apostrophe digunakan untuk kepemilikan dan contraction."
        },
        {
            type: "Concept",
            question: "Quotation marks are used for...",
            options: ["direct speech", "plural nouns", "uncountable nouns", "condition clauses"],
            answer: "direct speech",
            explanation: "Quotation marks menandai kutipan langsung."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The teachers' room is clean.",
                "The teachers room is clean.",
                "The teacher's room's is clean.",
                "The teachers's room is clean."
            ],
            answer: "The teachers' room is clean.",
            explanation: "Plural possession memakai apostrophe setelah s."
        }
    ]
},

"capitalization": {
    title: "Capitalization Rules",
    description: "Capitalization adalah aturan penggunaan huruf kapital dalam Bahasa Inggris. Huruf kapital digunakan pada awal kalimat, nama orang, tempat, hari, bulan, bahasa, kebangsaan, judul, dan kata I.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Capital Letter = huruf besar pada posisi atau kata tertentu
    `,

    notes: [
        "Gunakan huruf kapital pada awal kalimat.",
        "Gunakan huruf kapital untuk nama orang.",
        "Gunakan huruf kapital untuk nama tempat, kota, negara, dan benua.",
        "Gunakan huruf kapital untuk hari dan bulan.",
        "Gunakan huruf kapital untuk bahasa dan kebangsaan.",
        "Pronoun I selalu ditulis kapital.",
        "Dalam title, kata utama biasanya diawali huruf kapital."
    ],

    patterns: [
        {
            group: "Beginning & Pronoun",
            items: [
                {
                    label: "Sentence / I",
                    formula: "Capital letter at sentence beginning and pronoun I",
                    examples: [
                        "She is my friend.",
                        "I live in Indonesia.",
                        "Yesterday, I met Rina."
                    ]
                }
            ]
        },
        {
            group: "Proper Nouns",
            items: [
                {
                    label: "Names / Places",
                    formula: "Proper noun = capitalized",
                    examples: [
                        "Rina lives in Jakarta.",
                        "Indonesia is in Asia.",
                        "Mr. Smith teaches English."
                    ]
                }
            ]
        },
        {
            group: "Time / Language / Nationality",
            items: [
                {
                    label: "Days / Months / Languages",
                    formula: "Capitalize days, months, languages, nationalities",
                    examples: [
                        "We meet every Monday.",
                        "My birthday is in August.",
                        "She speaks English and Indonesian."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Beginning",
            question: "Which sentence is correctly capitalized?",
            options: [
                "She is my friend.",
                "she is my friend.",
                "she Is my friend.",
                "She is My friend."
            ],
            answer: "She is my friend.",
            explanation: "Awal kalimat harus menggunakan huruf kapital."
        },
        {
            type: "Pronoun I",
            question: "Which sentence is correct?",
            options: [
                "I like English.",
                "i like English.",
                "I like english.",
                "i like english."
            ],
            answer: "I like English.",
            explanation: "Pronoun I selalu kapital, dan English juga kapital."
        },
        {
            type: "Name",
            question: "Which sentence is correct?",
            options: [
                "Rina lives in Jakarta.",
                "rina lives in Jakarta.",
                "Rina lives in jakarta.",
                "rina lives in jakarta."
            ],
            answer: "Rina lives in Jakarta.",
            explanation: "Nama orang dan kota memakai huruf kapital."
        },
        {
            type: "Country",
            question: "Which word should be capitalized?",
            options: ["indonesia", "book", "water", "school"],
            answer: "indonesia",
            explanation: "Nama negara harus kapital: Indonesia."
        },
        {
            type: "Day",
            question: "Which sentence is correct?",
            options: [
                "We meet every Monday.",
                "We meet every monday.",
                "we meet every Monday.",
                "We Meet Every monday."
            ],
            answer: "We meet every Monday.",
            explanation: "Hari memakai huruf kapital."
        },
        {
            type: "Month",
            question: "Which sentence is correct?",
            options: [
                "My birthday is in August.",
                "My birthday is in august.",
                "my birthday is in August.",
                "My Birthday Is In august."
            ],
            answer: "My birthday is in August.",
            explanation: "Bulan memakai huruf kapital."
        },
        {
            type: "Language",
            question: "Which word should be capitalized?",
            options: ["english", "book", "table", "city"],
            answer: "english",
            explanation: "Nama bahasa harus kapital: English."
        },
        {
            type: "Nationality",
            question: "Which sentence is correct?",
            options: [
                "She is Indonesian.",
                "She is indonesian.",
                "she is Indonesian.",
                "She Is indonesian."
            ],
            answer: "She is Indonesian.",
            explanation: "Kebangsaan memakai huruf kapital."
        },
        {
            type: "Title",
            question: "Which title capitalization is better?",
            options: [
                "The Power of English Grammar",
                "the power of english grammar",
                "The power Of english Grammar",
                "the Power of English grammar"
            ],
            answer: "The Power of English Grammar",
            explanation: "Dalam title, kata utama biasanya diawali huruf kapital."
        },
        {
            type: "Error Check",
            question: "Which sentence is correctly capitalized?",
            options: [
                "On Friday, I will visit London.",
                "on Friday, i will visit London.",
                "On friday, I will visit london.",
                "on friday, i will visit london."
            ],
            answer: "On Friday, I will visit London.",
            explanation: "Awal kalimat, hari, pronoun I, dan nama kota harus kapital."
        }
    ]
},

"punctuation-review": {
    title: "Punctuation Review",
    description: "Review akhir untuk menguji seluruh materi punctuation dan capitalization, termasuk comma, period, question mark, exclamation mark, colon, semicolon, apostrophe, quotation marks, dan capitalization.",

    formula: `
        <strong>Ringkasan BAB 14:</strong><br>
        . = Statement<br>
        ? = Direct Question<br>
        ! = Strong Emotion<br>
        , = Separation / Pause<br>
        : = List / Explanation<br>
        ; = Related Independent Clauses<br>
        ' = Possession / Contraction<br>
        " " = Direct Speech<br>
        Capital Letters = Proper Usage
    `,

    notes: [
        "Gunakan period untuk statement.",
        "Gunakan question mark untuk pertanyaan langsung.",
        "Gunakan exclamation mark untuk emosi kuat.",
        "Comma digunakan untuk introductory phrases, daftar, dan compound sentence.",
        "Colon digunakan sebelum daftar atau penjelasan.",
        "Semicolon menghubungkan dua independent clauses yang berkaitan.",
        "Apostrophe digunakan untuk possession dan contraction.",
        "Quotation marks digunakan untuk direct speech.",
        "Capitalization berlaku pada awal kalimat, proper noun, hari, bulan, bahasa, kebangsaan, dan pronoun I."
    ],

    patterns: [
        {
            group: "Sentence End",
            items: [
                {
                    label: "End Marks",
                    formula: ". / ? / !",
                    examples: [
                        "She is a teacher.",
                        "Where do you live?",
                        "What a wonderful surprise!"
                    ]
                }
            ]
        },
        {
            group: "Sentence Structure",
            items: [
                {
                    label: "Comma / Colon / Semicolon",
                    formula: "Correct internal punctuation",
                    examples: [
                        "After class, we went home.",
                        "I need three things: food, water, and shelter.",
                        "She studied hard; she passed the exam."
                    ]
                }
            ]
        },
        {
            group: "Writing Rules",
            items: [
                {
                    label: "Apostrophe / Quotes / Capitals",
                    formula: "Possession, direct speech, capitalization",
                    examples: [
                        "Rina's book is new.",
                        "He said, \"I'm ready.\"",
                        "I will visit London on Monday."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Period",
            question: "Which punctuation ends a statement?",
            options: [".", "?", "!", ":"],
            answer: ".",
            explanation: "Statement diakhiri dengan period."
        },
        {
            type: "Question",
            question: "Which punctuation ends a direct question?",
            options: ["?", ".", "!", ";"],
            answer: "?",
            explanation: "Pertanyaan langsung memakai question mark."
        },
        {
            type: "Exclamation",
            question: "Which punctuation shows strong emotion?",
            options: ["!", ".", "?", ","],
            answer: "!",
            explanation: "Exclamation mark menunjukkan emosi kuat."
        },
        {
            type: "Comma",
            question: "Which sentence is correct?",
            options: [
                "After class, we went home.",
                "After, class we went home.",
                "After class we, went home.",
                "After class we went, home."
            ],
            answer: "After class, we went home.",
            explanation: "Introductory phrase diikuti comma."
        },
        {
            type: "List",
            question: "Which sentence uses commas correctly?",
            options: [
                "I bought apples, oranges, and bananas.",
                "I bought apples oranges, and bananas.",
                "I bought apples, oranges and, bananas.",
                "I bought, apples oranges and bananas."
            ],
            answer: "I bought apples, oranges, and bananas.",
            explanation: "Comma memisahkan item dalam daftar."
        },
        {
            type: "Colon",
            question: "I need three things___ time, money, and support.",
            options: [":", ";", ".", ","],
            answer: ":",
            explanation: "Colon memperkenalkan daftar."
        },
        {
            type: "Semicolon",
            question: "She studied hard___ she passed the exam.",
            options: [";", ":", ".", ","],
            answer: ";",
            explanation: "Semicolon menghubungkan dua independent clauses."
        },
        {
            type: "Apostrophe",
            question: "Choose the correct possessive form.",
            options: [
                "Rina's book",
                "Rinas book",
                "Rina book's",
                "Rinas' book"
            ],
            answer: "Rina's book",
            explanation: "Singular possession memakai 's."
        },
        {
            type: "Its",
            question: "The dog wagged ___ tail.",
            options: ["its", "it's", "its'", "it"],
            answer: "its",
            explanation: "Its tanpa apostrophe menunjukkan kepemilikan."
        },
        {
            type: "Quotation",
            question: "Which sentence is punctuated correctly?",
            options: [
                "She said, \"I am ready.\"",
                "She said \"I am ready.",
                "She said, I am ready.\"",
                "\"She said I am ready.\""
            ],
            answer: "She said, \"I am ready.\"",
            explanation: "Direct speech memakai comma dan quotation marks."
        },
        {
            type: "Capitalization",
            question: "Which sentence is correctly capitalized?",
            options: [
                "I will visit London on Monday.",
                "i will visit london on monday.",
                "I will visit london on Monday.",
                "I Will Visit London On monday."
            ],
            answer: "I will visit London on Monday.",
            explanation: "Pronoun I, nama kota, dan hari memakai huruf kapital."
        },
        {
            type: "Language",
            question: "Which word should be capitalized?",
            options: [
                "english",
                "table",
                "window",
                "computer"
            ],
            answer: "english",
            explanation: "Nama bahasa harus ditulis English."
        },
        {
            type: "Indirect Question",
            question: "Which sentence is correct?",
            options: [
                "I wonder where he lives.",
                "I wonder where he lives?",
                "I wonder where does he live?",
                "I wonder where does he live."
            ],
            answer: "I wonder where he lives.",
            explanation: "Indirect question memakai statement order dan period."
        },
        {
            type: "Subject-Verb",
            question: "Which sentence is incorrect?",
            options: [
                "The student, passed the exam.",
                "After school, we went home.",
                "She studied hard, so she passed.",
                "My brother, who lives in Bali, is a doctor."
            ],
            answer: "The student, passed the exam.",
            explanation: "Jangan pisahkan subject dan verb dengan comma."
        },
        {
            type: "Concept",
            question: "Semicolon connects...",
            options: [
                "two related independent clauses",
                "a noun and adjective",
                "a subject and verb",
                "an article and noun"
            ],
            answer: "two related independent clauses",
            explanation: "Semicolon menghubungkan dua independent clauses yang saling berkaitan."
        },
        {
            type: "Concept",
            question: "Colon is mainly used to introduce...",
            options: [
                "a list or explanation",
                "a direct question",
                "a quotation only",
                "a subject"
            ],
            answer: "a list or explanation",
            explanation: "Colon memperkenalkan daftar, penjelasan, atau contoh."
        },
        {
            type: "Concept",
            question: "Apostrophe is used for...",
            options: [
                "possession and contractions",
                "questions",
                "lists",
                "indirect speech"
            ],
            answer: "possession and contractions",
            explanation: "Apostrophe menunjukkan kepemilikan dan contraction."
        },
        {
            type: "Concept",
            question: "Quotation marks are mainly used for...",
            options: [
                "direct speech",
                "plural nouns",
                "articles",
                "passive voice"
            ],
            answer: "direct speech",
            explanation: "Quotation marks menandai kutipan langsung."
        },
        {
            type: "Final",
            question: "Which sentence is fully correct?",
            options: [
                "On Friday, I said, \"I'm ready.\"",
                "on Friday, i said \"I'm ready.\"",
                "On friday I said, \"I'm ready\".",
                "On Friday I said \"I'm ready.\""
            ],
            answer: "On Friday, I said, \"I'm ready.\"",
            explanation: "Huruf kapital, comma, apostrophe, dan quotation marks semuanya digunakan dengan benar."
        }
    ]
},

"common-mistakes": {
    title: "Introduction to Common Grammar Mistakes",
    description: "Common Grammar Mistakes adalah kesalahan grammar yang sering muncul dalam writing dan speaking. Materi ini membantu pengguna mengenali pola kesalahan umum agar kalimat menjadi lebih akurat, natural, dan profesional.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Error → Correction → Reason
    `,

    notes: [
        "Kesalahan grammar biasanya terjadi karena subject-verb agreement, tense, word form, preposition, atau sentence structure.",
        "Belajar dari error membuat pengguna lebih cepat memahami grammar secara praktis.",
        "Common mistakes sering muncul dalam writing test, TOEFL, IELTS, TOEIC, dan academic writing.",
        "Setiap kesalahan harus dianalisis berdasarkan pola, bukan hanya dihafal.",
        "Tujuan materi ini adalah meningkatkan akurasi kalimat."
    ],

    patterns: [
        {
            group: "Error Awareness",
            items: [
                {
                    label: "Incorrect vs Correct",
                    formula: "Wrong Sentence → Correct Sentence",
                    examples: [
                        "Wrong: She go to school every day.",
                        "Correct: She goes to school every day.",
                        "Reason: Subject she memakai verb + s/es dalam Simple Present."
                    ]
                },
                {
                    label: "Error Categories",
                    formula: "Grammar Error Types",
                    examples: [
                        "Subject-Verb Agreement: He play → He plays",
                        "Tense: Yesterday I go → Yesterday I went",
                        "Word Form: She is beauty → She is beautiful"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Common Grammar Mistakes are useful to study because they help improve...",
            options: ["accuracy", "color", "font size", "image quality"],
            answer: "accuracy",
            explanation: "Mempelajari common mistakes membantu meningkatkan akurasi grammar."
        },
        {
            type: "SVA",
            question: "Which sentence is correct?",
            options: [
                "She go to school.",
                "She goes to school.",
                "She going to school.",
                "She gone to school."
            ],
            answer: "She goes to school.",
            explanation: "Subject she memakai verb + s/es dalam Simple Present."
        },
        {
            type: "Tense",
            question: "Which sentence is correct?",
            options: [
                "Yesterday I go to school.",
                "Yesterday I went to school.",
                "Yesterday I goes to school.",
                "Yesterday I going to school."
            ],
            answer: "Yesterday I went to school.",
            explanation: "Yesterday menunjukkan past time, jadi gunakan V2."
        },
        {
            type: "Word Form",
            question: "Which sentence is correct?",
            options: [
                "She is beauty.",
                "She is beautiful.",
                "She is beautifully.",
                "She is beautify."
            ],
            answer: "She is beautiful.",
            explanation: "Setelah be untuk menjelaskan subject, gunakan adjective."
        },
        {
            type: "Preposition",
            question: "Which sentence is correct?",
            options: [
                "I am interested in English.",
                "I am interested on English.",
                "I am interested at English.",
                "I am interested for English."
            ],
            answer: "I am interested in English.",
            explanation: "Collocation yang benar adalah interested in."
        },
        {
            type: "Sentence Structure",
            question: "Which sentence is complete?",
            options: [
                "Because I was tired.",
                "Because I was tired, I went home.",
                "Although raining.",
                "When arrived."
            ],
            answer: "Because I was tired, I went home.",
            explanation: "Dependent clause membutuhkan main clause."
        },
        {
            type: "Concept",
            question: "Error correction should focus on...",
            options: ["pattern and reason", "guessing only", "memorizing colors", "removing all verbs"],
            answer: "pattern and reason",
            explanation: "Kesalahan harus dipahami berdasarkan pola dan alasan grammar."
        },
        {
            type: "Category",
            question: "'He play football every day' is mainly a...",
            options: [
                "subject-verb agreement error",
                "capitalization rule",
                "quotation error",
                "article only"
            ],
            answer: "subject-verb agreement error",
            explanation: "Subject he membutuhkan plays dalam Simple Present."
        },
        {
            type: "Category",
            question: "'She is beauty' is mainly a...",
            options: [
                "word form error",
                "tense error",
                "punctuation error",
                "relative clause"
            ],
            answer: "word form error",
            explanation: "Beauty adalah noun, sedangkan beautiful adalah adjective."
        },
        {
            type: "Final",
            question: "Which sentence is grammatically correct?",
            options: [
                "He don't like coffee.",
                "He doesn't like coffee.",
                "He doesn't likes coffee.",
                "He not like coffee."
            ],
            answer: "He doesn't like coffee.",
            explanation: "Negative Simple Present untuk he memakai doesn't + V1."
        }
    ]
},

"sva-errors": {
    title: "Subject-Verb Agreement Errors",
    description: "Subject-Verb Agreement Errors adalah kesalahan ketika subject dan verb tidak sesuai. Dalam Bahasa Inggris, verb harus menyesuaikan subject, terutama pada Simple Present dan kalimat dengan be verb.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Singular Subject + Singular Verb<br>
        Plural Subject + Plural Verb
    `,

    notes: [
        "He, she, it memakai verb + s/es dalam Simple Present.",
        "I, you, we, they memakai V1 biasa dalam Simple Present.",
        "Singular subject memakai is/was/has.",
        "Plural subject memakai are/were/have.",
        "Subject yang panjang tetap ditentukan oleh head noun.",
        "Prepositional phrase tidak mengubah subject utama."
    ],

    patterns: [
        {
            group: "Simple Present",
            items: [
                {
                    label: "He / She / It",
                    formula: "He/She/It + V1(s/es)",
                    examples: [
                        "Wrong: She go to school.",
                        "Correct: She goes to school.",
                        "Wrong: He play football.",
                        "Correct: He plays football."
                    ]
                },
                {
                    label: "I / You / We / They",
                    formula: "I/You/We/They + V1",
                    examples: [
                        "Wrong: They plays football.",
                        "Correct: They play football.",
                        "Wrong: We studies English.",
                        "Correct: We study English."
                    ]
                }
            ]
        },
        {
            group: "Be Verb",
            items: [
                {
                    label: "Is / Are",
                    formula: "Singular + is / Plural + are",
                    examples: [
                        "Wrong: She are happy.",
                        "Correct: She is happy.",
                        "Wrong: They is students.",
                        "Correct: They are students."
                    ]
                },
                {
                    label: "Was / Were",
                    formula: "Singular + was / Plural + were",
                    examples: [
                        "Wrong: He were tired.",
                        "Correct: He was tired.",
                        "Wrong: They was late.",
                        "Correct: They were late."
                    ]
                }
            ]
        },
        {
            group: "Tricky Subjects",
            items: [
                {
                    label: "Prepositional Phrase",
                    formula: "Subject + prepositional phrase + verb",
                    examples: [
                        "Wrong: The book on the tables are mine.",
                        "Correct: The book on the tables is mine.",
                        "Wrong: The students in the class is noisy.",
                        "Correct: The students in the class are noisy."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Simple Present",
            question: "She ___ to school every day.",
            options: ["go", "goes", "going", "gone"],
            answer: "goes",
            explanation: "Subject she memakai verb + s/es."
        },
        {
            type: "Simple Present",
            question: "They ___ football every Sunday.",
            options: ["play", "plays", "playing", "played"],
            answer: "play",
            explanation: "Subject they memakai V1 biasa."
        },
        {
            type: "Simple Present",
            question: "He ___ English well.",
            options: ["speak", "speaks", "speaking", "spoken"],
            answer: "speaks",
            explanation: "Subject he memakai verb + s/es."
        },
        {
            type: "Be Verb",
            question: "She ___ happy.",
            options: ["is", "are", "were", "be"],
            answer: "is",
            explanation: "She adalah singular subject, jadi gunakan is."
        },
        {
            type: "Be Verb",
            question: "They ___ students.",
            options: ["is", "are", "am", "be"],
            answer: "are",
            explanation: "They adalah plural subject, jadi gunakan are."
        },
        {
            type: "Past Be",
            question: "He ___ tired yesterday.",
            options: ["was", "were", "are", "be"],
            answer: "was",
            explanation: "He memakai was untuk past be."
        },
        {
            type: "Past Be",
            question: "We ___ late yesterday.",
            options: ["was", "were", "is", "am"],
            answer: "were",
            explanation: "We memakai were untuk past be."
        },
        {
            type: "Tricky Subject",
            question: "The book on the tables ___ mine.",
            options: ["is", "are", "were", "be"],
            answer: "is",
            explanation: "Subject utama adalah book, bukan tables."
        },
        {
            type: "Tricky Subject",
            question: "The students in the class ___ noisy.",
            options: ["is", "are", "was", "be"],
            answer: "are",
            explanation: "Subject utama adalah students."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "He play football every day.",
                "He plays football every day.",
                "He playing football every day.",
                "He played football every day."
            ],
            answer: "He plays football every day.",
            explanation: "Simple Present dengan he memakai plays."
        }
    ]
},

"tense-consistency-errors": {
    title: "Tense Consistency Errors",
    description: "Tense Consistency Errors terjadi ketika sebuah kalimat atau paragraf berpindah tense tanpa alasan yang jelas. Dalam writing, tense harus tetap konsisten kecuali memang ada perubahan waktu kejadian.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Same Time → Same Tense<br>
        Different Time → Different Tense
    `,

    notes: [
        "Gunakan tense yang sama jika semua kejadian terjadi pada waktu yang sama.",
        "Ubah tense hanya jika waktu kejadian memang berubah.",
        "Simple Present digunakan untuk fakta dan kebiasaan.",
        "Simple Past digunakan untuk kejadian yang selesai di masa lampau.",
        "Narrative writing biasanya mempertahankan satu tense utama.",
        "Time expressions seperti yesterday, now, tomorrow membantu menentukan tense."
    ],

    patterns: [
        {
            group: "Present Consistency",
            items: [
                {
                    label: "Simple Present",
                    formula: "Present + Present",
                    examples: [
                        "Wrong: She goes to school and studied English every day.",
                        "Correct: She goes to school and studies English every day.",
                        "Correct: He works in Jakarta and lives with his family."
                    ]
                }
            ]
        },
        {
            group: "Past Consistency",
            items: [
                {
                    label: "Simple Past",
                    formula: "Past + Past",
                    examples: [
                        "Wrong: Yesterday I went home and watch TV.",
                        "Correct: Yesterday I went home and watched TV.",
                        "Correct: She arrived, sat down, and opened her book."
                    ]
                }
            ]
        },
        {
            group: "Time Shift",
            items: [
                {
                    label: "Correct Tense Change",
                    formula: "Past event → Present fact",
                    examples: [
                        "I studied hard because the exam was difficult.",
                        "I studied hard because English is important.",
                        "She moved to London, and now she works there."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Present",
            question: "She ___ to school and ___ English every day.",
            options: [
                "goes / studies",
                "goes / studied",
                "went / studies",
                "go / study"
            ],
            answer: "goes / studies",
            explanation: "Dua aktivitas rutin memakai Simple Present."
        },
        {
            type: "Past",
            question: "Yesterday I ___ home and ___ TV.",
            options: [
                "went / watched",
                "went / watch",
                "go / watched",
                "go / watch"
            ],
            answer: "went / watched",
            explanation: "Yesterday menunjukkan Simple Past."
        },
        {
            type: "Past",
            question: "She ___, sat down, and opened her book.",
            options: [
                "arrived",
                "arrives",
                "arrive",
                "arriving"
            ],
            answer: "arrived",
            explanation: "Semua aksi terjadi di masa lampau."
        },
        {
            type: "Present",
            question: "He ___ in Jakarta and ___ with his family.",
            options: [
                "works / lives",
                "worked / lives",
                "works / lived",
                "worked / lived"
            ],
            answer: "works / lives",
            explanation: "Dua fakta sekarang memakai Simple Present."
        },
        {
            type: "Time Shift",
            question: "Which sentence uses tense correctly?",
            options: [
                "I studied hard because English is important.",
                "I studied hard because English was important yesterday only.",
                "I study hard because English was important now.",
                "I studied hard because English will important."
            ],
            answer: "I studied hard because English is important.",
            explanation: "Peristiwa lampau dapat diikuti fakta umum dalam Simple Present."
        },
        {
            type: "Consistency",
            question: "Which sentence is consistent?",
            options: [
                "She cooked dinner and washed the dishes.",
                "She cooked dinner and washes the dishes.",
                "She cooks dinner and washed the dishes.",
                "She cooking dinner and washed the dishes."
            ],
            answer: "She cooked dinner and washed the dishes.",
            explanation: "Kedua aksi terjadi pada waktu yang sama di masa lampau."
        },
        {
            type: "Time Expression",
            question: "Which word usually signals Simple Past?",
            options: [
                "yesterday",
                "every day",
                "always",
                "usually"
            ],
            answer: "yesterday",
            explanation: "Yesterday menunjukkan waktu lampau."
        },
        {
            type: "Concept",
            question: "A tense should normally change only when...",
            options: [
                "the time reference changes",
                "the subject changes",
                "the sentence becomes longer",
                "an adjective appears"
            ],
            answer: "the time reference changes",
            explanation: "Perubahan tense mengikuti perubahan waktu."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "He finished his homework and went to bed.",
                "He finished his homework and goes to bed.",
                "He finishes his homework and went to bed.",
                "He finishing his homework and went to bed."
            ],
            answer: "He finished his homework and went to bed.",
            explanation: "Dua aksi lampau memakai Simple Past."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She studies English because she wants to work abroad.",
                "She studies English because she wanted to work abroad every day.",
                "She studied English because she wants worked abroad.",
                "She study English because she wanted abroad."
            ],
            answer: "She studies English because she wants to work abroad.",
            explanation: "Kebiasaan dan tujuan saat ini memakai Simple Present."
        }
    ]
},

"word-form-errors": {
    title: "Word Form Errors",
    description: "Word Form Errors terjadi ketika bentuk kata yang digunakan tidak sesuai dengan fungsi grammar dalam kalimat. Kesalahan ini sering melibatkan noun, verb, adjective, dan adverb.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Noun = person/thing<br>
        Verb = action/state<br>
        Adjective = describes noun<br>
        Adverb = describes verb/adjective/adverb
    `,

    notes: [
        "Setelah be verb biasanya digunakan adjective, bukan noun atau adverb.",
        "Setelah article (a, an, the) biasanya digunakan noun atau adjective + noun.",
        "Setelah modal verb gunakan V1.",
        "Setelah very gunakan adjective atau adverb, bukan noun.",
        "Adverb biasanya berakhiran -ly, tetapi tidak selalu.",
        "Kenali fungsi kata sebelum memilih bentuk yang benar."
    ],

    patterns: [
        {
            group: "Noun vs Adjective",
            items: [
                {
                    label: "After Be Verb",
                    formula: "Subject + be + adjective",
                    examples: [
                        "Wrong: She is beauty.",
                        "Correct: She is beautiful.",
                        "Wrong: The movie was excitement.",
                        "Correct: The movie was exciting."
                    ]
                }
            ]
        },
        {
            group: "Adjective vs Adverb",
            items: [
                {
                    label: "Modify Verb",
                    formula: "Verb + adverb",
                    examples: [
                        "Wrong: She sings beautiful.",
                        "Correct: She sings beautifully.",
                        "Wrong: He drives careful.",
                        "Correct: He drives carefully."
                    ]
                }
            ]
        },
        {
            group: "Verb Form",
            items: [
                {
                    label: "After Modal",
                    formula: "Modal + V1",
                    examples: [
                        "Wrong: She can sings.",
                        "Correct: She can sing.",
                        "Wrong: They must finished.",
                        "Correct: They must finish."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Adjective",
            question: "She is ___.",
            options: ["beauty", "beautiful", "beautifully", "beautify"],
            answer: "beautiful",
            explanation: "Setelah be verb gunakan adjective."
        },
        {
            type: "Adverb",
            question: "She sings ___.",
            options: ["beautiful", "beauty", "beautifully", "beautify"],
            answer: "beautifully",
            explanation: "Verb sings dimodifikasi oleh adverb."
        },
        {
            type: "Adverb",
            question: "He drives ___.",
            options: ["careful", "carefully", "care", "carefulness"],
            answer: "carefully",
            explanation: "Verb drives membutuhkan adverb."
        },
        {
            type: "Modal",
            question: "She can ___.",
            options: ["sing", "sings", "sang", "singing"],
            answer: "sing",
            explanation: "Modal selalu diikuti V1."
        },
        {
            type: "Modal",
            question: "They must ___ the report today.",
            options: ["finish", "finishes", "finished", "finishing"],
            answer: "finish",
            explanation: "Must diikuti bentuk dasar verb."
        },
        {
            type: "Article",
            question: "He is a good ___.",
            options: ["teacher", "teach", "teaches", "teaching"],
            answer: "teacher",
            explanation: "Setelah article dan adjective gunakan noun."
        },
        {
            type: "Very",
            question: "The exam was very ___.",
            options: ["difficulty", "difficult", "difficultly", "difficultness"],
            answer: "difficult",
            explanation: "Very diikuti adjective."
        },
        {
            type: "Concept",
            question: "Which word modifies a verb?",
            options: ["Adverb", "Noun", "Article", "Pronoun"],
            answer: "Adverb",
            explanation: "Adverb menjelaskan verb."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She speaks English fluently.",
                "She speaks English fluent.",
                "She speaks English fluency.",
                "She speaks English influence."
            ],
            answer: "She speaks English fluently.",
            explanation: "Verb speaks dimodifikasi oleh adverb fluently."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The movie was exciting.",
                "The movie was excitement.",
                "The movie was excitedly.",
                "The movie was excite."
            ],
            answer: "The movie was exciting.",
            explanation: "Setelah be verb gunakan adjective."
        }
    ]
},

"preposition-errors": {
    title: "Preposition Errors",
    description: "Preposition Errors adalah kesalahan dalam memilih preposition yang tepat. Banyak verb, adjective, dan noun dalam Bahasa Inggris memiliki pasangan preposition (collocation) yang harus dihafal.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb/Adjective/Noun + Correct Preposition
    `,

    notes: [
        "Banyak preposition tidak dapat diterjemahkan secara harfiah dari Bahasa Indonesia.",
        "Verb tertentu memiliki pasangan preposition tetap (depend on, belong to).",
        "Adjective tertentu juga memiliki pasangan tetap (interested in, afraid of).",
        "Gunakan at, on, dan in sesuai aturan waktu dan tempat.",
        "Kesalahan preposition merupakan salah satu kesalahan paling umum dalam writing."
    ],

    patterns: [
        {
            group: "Verb + Preposition",
            items: [
                {
                    label: "Common Collocations",
                    formula: "Verb + Preposition",
                    examples: [
                        "Wrong: depend of",
                        "Correct: depend on",
                        "Wrong: belong with me",
                        "Correct: belong to me",
                        "Wrong: listen music",
                        "Correct: listen to music"
                    ]
                }
            ]
        },
        {
            group: "Adjective + Preposition",
            items: [
                {
                    label: "Common Adjective Collocations",
                    formula: "Adjective + Preposition",
                    examples: [
                        "interested in English",
                        "afraid of spiders",
                        "good at mathematics",
                        "famous for its beaches"
                    ]
                }
            ]
        },
        {
            group: "Time & Place",
            items: [
                {
                    label: "At / On / In",
                    formula: "Time & Place Prepositions",
                    examples: [
                        "at 7 o'clock",
                        "on Monday",
                        "in July",
                        "at the station",
                        "on the table",
                        "in the room"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Verb",
            question: "You can always depend ___ me.",
            options: ["on", "of", "at", "for"],
            answer: "on",
            explanation: "Collocation yang benar adalah depend on."
        },
        {
            type: "Verb",
            question: "This bag belongs ___ my sister.",
            options: ["to", "with", "for", "at"],
            answer: "to",
            explanation: "Belong selalu diikuti to."
        },
        {
            type: "Verb",
            question: "She likes listening ___ music.",
            options: ["to", "on", "at", "for"],
            answer: "to",
            explanation: "Listen selalu diikuti preposition to."
        },
        {
            type: "Adjective",
            question: "I am interested ___ English.",
            options: ["in", "on", "at", "to"],
            answer: "in",
            explanation: "Interested selalu diikuti in."
        },
        {
            type: "Adjective",
            question: "He is good ___ mathematics.",
            options: ["at", "on", "for", "in"],
            answer: "at",
            explanation: "Good at adalah collocation yang benar."
        },
        {
            type: "Adjective",
            question: "She is afraid ___ spiders.",
            options: ["of", "with", "to", "on"],
            answer: "of",
            explanation: "Afraid of adalah pasangan yang benar."
        },
        {
            type: "Time",
            question: "The meeting starts ___ Monday.",
            options: ["on", "at", "in", "to"],
            answer: "on",
            explanation: "Hari menggunakan on."
        },
        {
            type: "Time",
            question: "My birthday is ___ July.",
            options: ["in", "on", "at", "to"],
            answer: "in",
            explanation: "Bulan menggunakan in."
        },
        {
            type: "Place",
            question: "The keys are ___ the table.",
            options: ["on", "in", "at", "to"],
            answer: "on",
            explanation: "Permukaan menggunakan on."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "She is famous for her singing.",
                "She is famous of her singing.",
                "She is famous at her singing.",
                "She is famous on her singing."
            ],
            answer: "She is famous for her singing.",
            explanation: "Famous for adalah collocation yang benar."
        }
    ]
},

"sentence-structure-errors": {
    title: "Sentence Structure Errors",
    description: "Sentence Structure Errors terjadi ketika susunan kalimat tidak lengkap atau tidak mengikuti aturan grammar. Kesalahan yang paling umum adalah sentence fragment, run-on sentence, comma splice, double subject, dan double negative.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Complete Sentence = Subject + Verb + Complete Thought
    `,

    notes: [
        "Kalimat lengkap harus memiliki minimal subject dan verb serta menyampaikan ide yang utuh.",
        "Sentence fragment adalah kalimat yang belum lengkap.",
        "Run-on sentence terjadi ketika dua independent clauses digabung tanpa tanda baca atau conjunction yang benar.",
        "Comma splice adalah dua independent clauses yang hanya dipisahkan comma.",
        "Hindari double subject dan double negative dalam Standard English.",
        "Setiap independent clause harus dipisahkan dengan benar menggunakan period, semicolon, atau conjunction."
    ],

    patterns: [
        {
            group: "Sentence Fragment",
            items: [
                {
                    label: "Incomplete Sentence",
                    formula: "Dependent Clause ≠ Complete Sentence",
                    examples: [
                        "Wrong: Because I was tired.",
                        "Correct: Because I was tired, I went home.",
                        "Wrong: When she arrived.",
                        "Correct: When she arrived, we started the meeting."
                    ]
                }
            ]
        },
        {
            group: "Run-on Sentence",
            items: [
                {
                    label: "Two Independent Clauses",
                    formula: "Clause + conjunction/comma/semicolon + Clause",
                    examples: [
                        "Wrong: I was tired I went home.",
                        "Correct: I was tired, so I went home.",
                        "Correct: I was tired. I went home."
                    ]
                }
            ]
        },
        {
            group: "Comma Splice",
            items: [
                {
                    label: "Comma Only",
                    formula: "Clause, Clause ❌",
                    examples: [
                        "Wrong: She studied hard, she passed.",
                        "Correct: She studied hard, so she passed.",
                        "Correct: She studied hard; she passed."
                    ]
                }
            ]
        },
        {
            group: "Double Subject & Double Negative",
            items: [
                {
                    label: "Common Errors",
                    formula: "Avoid unnecessary repetition",
                    examples: [
                        "Wrong: My brother he is a doctor.",
                        "Correct: My brother is a doctor.",
                        "Wrong: I don't know nothing.",
                        "Correct: I don't know anything."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Fragment",
            question: "Which sentence is complete?",
            options: [
                "Because I was tired, I went home.",
                "Because I was tired.",
                "When she arrived.",
                "Although raining."
            ],
            answer: "Because I was tired, I went home.",
            explanation: "Dependent clause membutuhkan main clause."
        },
        {
            type: "Fragment",
            question: "Which sentence is a fragment?",
            options: [
                "When she arrived.",
                "She arrived on time.",
                "They finished the project.",
                "He plays football."
            ],
            answer: "When she arrived.",
            explanation: "Kalimat belum memiliki main clause."
        },
        {
            type: "Run-on",
            question: "Which sentence fixes the run-on correctly?",
            options: [
                "I was tired, so I went home.",
                "I was tired I went home.",
                "I was tired, I went home.",
                "I was tired because."
            ],
            answer: "I was tired, so I went home.",
            explanation: "Gunakan conjunction untuk menghubungkan dua independent clauses."
        },
        {
            type: "Comma Splice",
            question: "Which sentence is correct?",
            options: [
                "She studied hard; she passed.",
                "She studied hard, she passed.",
                "She studied hard she passed.",
                "She studied hard because."
            ],
            answer: "She studied hard; she passed.",
            explanation: "Semicolon dapat menghubungkan dua independent clauses."
        },
        {
            type: "Double Subject",
            question: "Which sentence is correct?",
            options: [
                "My brother is a doctor.",
                "My brother he is a doctor.",
                "My brother he doctor.",
                "Brother my he is doctor."
            ],
            answer: "My brother is a doctor.",
            explanation: "Jangan gunakan double subject."
        },
        {
            type: "Double Negative",
            question: "Which sentence is correct?",
            options: [
                "I don't know anything.",
                "I don't know nothing.",
                "I not know nothing.",
                "I don't nothing know."
            ],
            answer: "I don't know anything.",
            explanation: "Standard English menghindari double negative."
        },
        {
            type: "Complete Sentence",
            question: "A complete sentence must have...",
            options: [
                "a subject and a verb",
                "an adjective only",
                "a preposition only",
                "a comma only"
            ],
            answer: "a subject and a verb",
            explanation: "Kalimat lengkap minimal memiliki subject dan verb."
        },
        {
            type: "Concept",
            question: "A run-on sentence is...",
            options: [
                "two independent clauses joined incorrectly",
                "a sentence with many adjectives",
                "a sentence without nouns",
                "a sentence with quotation marks"
            ],
            answer: "two independent clauses joined incorrectly",
            explanation: "Run-on terjadi ketika dua independent clauses tidak dipisahkan dengan benar."
        },
        {
            type: "Concept",
            question: "A comma splice happens when...",
            options: [
                "two independent clauses are joined only by a comma",
                "a comma follows an introductory phrase",
                "a comma separates items in a list",
                "a comma follows a direct address"
            ],
            answer: "two independent clauses are joined only by a comma",
            explanation: "Comma splice adalah penggunaan comma tanpa conjunction atau semicolon."
        },
        {
            type: "Error Check",
            question: "Which sentence is grammatically correct?",
            options: [
                "Although it was raining, we continued the game.",
                "Although it was raining.",
                "Although raining we continued.",
                "Although, it was raining."
            ],
            answer: "Although it was raining, we continued the game.",
            explanation: "Dependent clause harus diikuti main clause agar menjadi kalimat lengkap."
        }
    ]
},

"common-mistakes-review": {
    title: "Common Mistakes Review",
    description: "Review akhir untuk menguji seluruh materi Common Grammar Mistakes, termasuk subject-verb agreement, tense consistency, word form, preposition, dan sentence structure.",

    formula: `
        <strong>Ringkasan BAB 15:</strong><br>
        Subject ↔ Verb Agreement<br>
        Consistent Tense<br>
        Correct Word Form<br>
        Correct Preposition<br>
        Complete Sentence Structure
    `,

    notes: [
        "Pastikan subject dan verb selalu sesuai.",
        "Gunakan tense yang konsisten sesuai waktu kejadian.",
        "Pilih bentuk kata sesuai fungsinya (noun, verb, adjective, adverb).",
        "Gunakan preposition sesuai collocation yang benar.",
        "Hindari sentence fragment, run-on sentence, comma splice, double subject, dan double negative.",
        "Perbaiki kesalahan berdasarkan pola grammar, bukan hanya menghafal."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Subject-Verb Agreement",
                    formula: "Singular ↔ Singular Verb | Plural ↔ Plural Verb",
                    examples: [
                        "She goes to school.",
                        "They play football.",
                        "The book on the table is mine."
                    ]
                },
                {
                    label: "Tense & Word Form",
                    formula: "Consistent Tense + Correct Word Form",
                    examples: [
                        "Yesterday I went home and watched TV.",
                        "She is beautiful.",
                        "He drives carefully."
                    ]
                },
                {
                    label: "Preposition & Structure",
                    formula: "Correct Preposition + Complete Sentence",
                    examples: [
                        "I am interested in English.",
                        "Because I was tired, I went home.",
                        "She studied hard, so she passed."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Subject-Verb Agreement",
            question: "She ___ to school every day.",
            options: ["go", "goes", "going", "gone"],
            answer: "goes",
            explanation: "Subject she memakai verb + s/es."
        },
        {
            type: "Subject-Verb Agreement",
            question: "The students in the class ___ ready.",
            options: ["is", "are", "was", "be"],
            answer: "are",
            explanation: "Subject utama adalah students."
        },
        {
            type: "Tense",
            question: "Yesterday I ___ home and ___ TV.",
            options: [
                "went / watched",
                "went / watch",
                "go / watched",
                "go / watch"
            ],
            answer: "went / watched",
            explanation: "Yesterday menunjukkan Simple Past."
        },
        {
            type: "Word Form",
            question: "She sings ___.",
            options: ["beautiful", "beauty", "beautifully", "beautify"],
            answer: "beautifully",
            explanation: "Verb dimodifikasi oleh adverb."
        },
        {
            type: "Word Form",
            question: "The movie was ___.",
            options: ["exciting", "excitement", "excitedly", "excite"],
            answer: "exciting",
            explanation: "Setelah be verb gunakan adjective."
        },
        {
            type: "Preposition",
            question: "I am interested ___ English.",
            options: ["in", "on", "at", "to"],
            answer: "in",
            explanation: "Interested in adalah collocation yang benar."
        },
        {
            type: "Preposition",
            question: "The meeting starts ___ Monday.",
            options: ["on", "at", "in", "for"],
            answer: "on",
            explanation: "Hari menggunakan on."
        },
        {
            type: "Sentence Structure",
            question: "Which sentence is complete?",
            options: [
                "Because I was tired, I went home.",
                "Because I was tired.",
                "When she arrived.",
                "Although raining."
            ],
            answer: "Because I was tired, I went home.",
            explanation: "Dependent clause membutuhkan main clause."
        },
        {
            type: "Run-on Sentence",
            question: "Which sentence is correct?",
            options: [
                "I was tired, so I went home.",
                "I was tired I went home.",
                "I was tired, I went home.",
                "I was tired because."
            ],
            answer: "I was tired, so I went home.",
            explanation: "Gunakan conjunction untuk menghubungkan dua independent clauses."
        },
        {
            type: "Comma Splice",
            question: "Which sentence is correct?",
            options: [
                "She studied hard; she passed.",
                "She studied hard, she passed.",
                "She studied hard she passed.",
                "She studied hard because."
            ],
            answer: "She studied hard; she passed.",
            explanation: "Semicolon dapat menghubungkan dua independent clauses."
        },
        {
            type: "Double Subject",
            question: "Which sentence is correct?",
            options: [
                "My brother is a doctor.",
                "My brother he is a doctor.",
                "My brother he doctor.",
                "Brother my he is doctor."
            ],
            answer: "My brother is a doctor.",
            explanation: "Hindari double subject."
        },
        {
            type: "Double Negative",
            question: "Which sentence is correct?",
            options: [
                "I don't know anything.",
                "I don't know nothing.",
                "I not know nothing.",
                "I don't nothing know."
            ],
            answer: "I don't know anything.",
            explanation: "Standard English menghindari double negative."
        },
        {
            type: "Concept",
            question: "Which part of speech usually modifies a verb?",
            options: [
                "Adverb",
                "Noun",
                "Pronoun",
                "Article"
            ],
            answer: "Adverb",
            explanation: "Adverb menjelaskan verb."
        },
        {
            type: "Concept",
            question: "Tense should normally change only when...",
            options: [
                "the time reference changes",
                "the subject changes",
                "the sentence becomes longer",
                "an adjective appears"
            ],
            answer: "the time reference changes",
            explanation: "Perubahan tense mengikuti perubahan waktu."
        },
        {
            type: "Concept",
            question: "A complete sentence must contain...",
            options: [
                "a subject and a verb",
                "an article and a noun",
                "a comma and a conjunction",
                "an adjective and an adverb"
            ],
            answer: "a subject and a verb",
            explanation: "Kalimat lengkap minimal memiliki subject dan verb."
        },
        {
            type: "Error Check",
            question: "Which sentence is grammatically correct?",
            options: [
                "He doesn't like coffee.",
                "He don't like coffee.",
                "He doesn't likes coffee.",
                "He not like coffee."
            ],
            answer: "He doesn't like coffee.",
            explanation: "Negative Simple Present untuk he memakai doesn't + V1."
        },
        {
            type: "Error Check",
            question: "Which sentence is grammatically correct?",
            options: [
                "She is good at mathematics.",
                "She is good in mathematics.",
                "She is good on mathematics.",
                "She is good to mathematics."
            ],
            answer: "She is good at mathematics.",
            explanation: "Good at adalah collocation yang benar."
        },
        {
            type: "Error Check",
            question: "Which sentence is grammatically correct?",
            options: [
                "The book on the shelves is expensive.",
                "The book on the shelves are expensive.",
                "The book on the shelves were expensive.",
                "The book on the shelves be expensive."
            ],
            answer: "The book on the shelves is expensive.",
            explanation: "Subject utama adalah book, sehingga verb harus singular."
        },
        {
            type: "Error Check",
            question: "Which sentence is grammatically correct?",
            options: [
                "She can speak English fluently.",
                "She can speaks English fluently.",
                "She can speaking English fluently.",
                "She can spoke English fluently."
            ],
            answer: "She can speak English fluently.",
            explanation: "Modal verb selalu diikuti V1."
        },
        {
            type: "Final",
            question: "Which sentence contains no grammar mistakes?",
            options: [
                "Although it was raining, we continued the match.",
                "Although it was raining.",
                "Although raining we continued.",
                "Although, it was raining."
            ],
            answer: "Although it was raining, we continued the match.",
            explanation: "Kalimat memiliki dependent clause, main clause, dan struktur grammar yang lengkap."
        }
    ]
},

"advanced-sentences": {
    title: "Introduction to Advanced Sentences",
    description: "Advanced Sentence Patterns adalah pola kalimat tingkat lanjut yang digunakan untuk membuat tulisan lebih jelas, kuat, formal, dan variatif. Pola ini sering muncul dalam academic writing, IELTS, TOEFL, dan formal English.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Advanced Sentence = Clear Structure + Emphasis + Logical Connection
    `,

    notes: [
        "Advanced sentence tidak berarti kalimat harus panjang.",
        "Kalimat advanced harus jelas, terstruktur, dan efektif.",
        "Cleft sentence digunakan untuk memberi penekanan.",
        "Parallel structure membuat kalimat seimbang.",
        "Ellipsis menghindari pengulangan yang tidak perlu.",
        "Fronting memindahkan bagian penting ke awal kalimat.",
        "Discourse markers menghubungkan ide secara logis."
    ],

    patterns: [
        {
            group: "Core Patterns",
            items: [
                {
                    label: "Emphasis",
                    formula: "It is/was + focus + that/who + clause",
                    examples: [
                        "It was John who solved the problem.",
                        "It is discipline that makes progress possible.",
                        "What I need is more time."
                    ]
                },
                {
                    label: "Parallel Structure",
                    formula: "same grammatical form + same grammatical form",
                    examples: [
                        "She likes reading, writing, and speaking.",
                        "The course is useful, practical, and affordable.",
                        "He came, saw, and won."
                    ]
                },
                {
                    label: "Logical Connection",
                    formula: "idea + discourse marker + idea",
                    examples: [
                        "The task was difficult; however, we completed it.",
                        "The evidence is limited. Therefore, more research is needed.",
                        "English is important. Moreover, it opens global opportunities."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Advanced sentence patterns are mainly used to make writing...",
            options: ["clearer and more effective", "longer only", "more confusing", "less formal"],
            answer: "clearer and more effective",
            explanation: "Advanced patterns membuat kalimat lebih jelas, kuat, dan variatif."
        },
        {
            type: "Concept",
            question: "A good advanced sentence should be...",
            options: ["clear and structured", "always very long", "without verbs", "without punctuation"],
            answer: "clear and structured",
            explanation: "Kalimat advanced tidak harus panjang; yang penting jelas dan terstruktur."
        },
        {
            type: "Emphasis",
            question: "Which pattern is used for emphasis?",
            options: ["Cleft sentence", "Plural noun", "Article", "Basic adjective"],
            answer: "Cleft sentence",
            explanation: "Cleft sentence digunakan untuk memberi penekanan."
        },
        {
            type: "Parallel",
            question: "Parallel structure means using...",
            options: [
                "the same grammatical form",
                "random verb forms",
                "only nouns",
                "only adjectives"
            ],
            answer: "the same grammatical form",
            explanation: "Parallel structure menjaga bentuk grammar tetap seimbang."
        },
        {
            type: "Ellipsis",
            question: "Ellipsis helps avoid...",
            options: ["unnecessary repetition", "all verbs", "all subjects", "all punctuation"],
            answer: "unnecessary repetition",
            explanation: "Ellipsis menghilangkan bagian yang sudah jelas agar kalimat lebih ringkas."
        },
        {
            type: "Fronting",
            question: "Fronting moves an important element to...",
            options: ["the beginning of the sentence", "the end only", "the middle only", "nowhere"],
            answer: "the beginning of the sentence",
            explanation: "Fronting memindahkan elemen penting ke awal kalimat."
        },
        {
            type: "Discourse Marker",
            question: "Which word is a discourse marker?",
            options: ["however", "book", "beautiful", "quickly"],
            answer: "however",
            explanation: "However menghubungkan dua ide yang kontras."
        },
        {
            type: "Example",
            question: "Which sentence uses parallel structure?",
            options: [
                "She likes reading, writing, and speaking.",
                "She likes reading, to write, and speaks.",
                "She likes read, writing, and to speak.",
                "She likes reads, wrote, and speaking."
            ],
            answer: "She likes reading, writing, and speaking.",
            explanation: "Semua item memakai bentuk V-ing."
        },
        {
            type: "Example",
            question: "Which sentence uses emphasis?",
            options: [
                "It was John who solved the problem.",
                "John solved the problem.",
                "The problem was difficult.",
                "John is a student."
            ],
            answer: "It was John who solved the problem.",
            explanation: "It was John who... adalah cleft sentence."
        },
        {
            type: "Final",
            question: "Advanced sentence patterns are especially useful in...",
            options: ["academic and formal writing", "spelling only", "alphabet practice", "basic counting"],
            answer: "academic and formal writing",
            explanation: "Pola ini banyak digunakan dalam academic writing, formal English, dan ujian bahasa Inggris."
        }
    ]
},

"cleft-sentences": {
    title: "Emphasis (Cleft Sentences)",
    description: "Cleft Sentence adalah pola kalimat yang digunakan untuk memberi penekanan pada bagian tertentu, seperti subject, object, time, place, atau reason. Pola ini sering digunakan dalam formal writing dan speaking tingkat lanjut.",

    formula: `
        <strong>Inti Materi:</strong><br>
        It is/was + Focus + who/that + clause<br>
        What + clause + be + focus
    `,

    notes: [
        "Cleft sentence digunakan untuk menekankan informasi penting.",
        "It-cleft memakai pola it is/was + focus + who/that.",
        "Who digunakan jika focus adalah orang.",
        "That digunakan untuk benda, waktu, tempat, alasan, atau informasi umum.",
        "What-cleft memakai pola what + clause + be + focus.",
        "Cleft sentence membuat kalimat lebih kuat dan formal."
    ],

    patterns: [
        {
            group: "It-Cleft",
            items: [
                {
                    label: "Emphasize Subject",
                    formula: "It is/was + person + who + clause",
                    examples: [
                        "It was John who solved the problem.",
                        "It is my teacher who inspired me.",
                        "It was Rina who called you yesterday."
                    ]
                },
                {
                    label: "Emphasize Object / Time / Place",
                    formula: "It is/was + focus + that + clause",
                    examples: [
                        "It was the red bag that she bought.",
                        "It was yesterday that I met him.",
                        "It was in London that they got married."
                    ]
                }
            ]
        },
        {
            group: "What-Cleft",
            items: [
                {
                    label: "Emphasize Information",
                    formula: "What + subject + verb + be + focus",
                    examples: [
                        "What I need is more time.",
                        "What she wants is a new laptop.",
                        "What they discussed was the budget."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "It-Cleft",
            question: "___ John who solved the problem.",
            options: ["It was", "What was", "There was", "That was"],
            answer: "It was",
            explanation: "It-cleft memakai It is/was + focus + who/that."
        },
        {
            type: "It-Cleft",
            question: "It was Rina ___ called you yesterday.",
            options: ["who", "where", "when", "whose"],
            answer: "who",
            explanation: "Gunakan who ketika focus adalah orang."
        },
        {
            type: "That",
            question: "It was the red bag ___ she bought.",
            options: ["that", "who", "where", "when"],
            answer: "that",
            explanation: "That digunakan untuk object atau benda."
        },
        {
            type: "Time",
            question: "It was yesterday ___ I met him.",
            options: ["that", "who", "whose", "where"],
            answer: "that",
            explanation: "That digunakan untuk menekankan waktu."
        },
        {
            type: "Place",
            question: "It was in London ___ they got married.",
            options: ["that", "who", "whose", "whom"],
            answer: "that",
            explanation: "That digunakan untuk menekankan tempat."
        },
        {
            type: "What-Cleft",
            question: "___ I need is more time.",
            options: ["What", "That", "Where", "When"],
            answer: "What",
            explanation: "What-cleft memakai What + clause + be + focus."
        },
        {
            type: "What-Cleft",
            question: "What she wants ___ a new laptop.",
            options: ["is", "are", "be", "were"],
            answer: "is",
            explanation: "Focus-nya singular, jadi gunakan is."
        },
        {
            type: "Concept",
            question: "Cleft sentences are used for...",
            options: ["emphasis", "plural nouns", "articles only", "basic spelling"],
            answer: "emphasis",
            explanation: "Cleft sentence memberi penekanan pada bagian tertentu."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "It was John who solved the problem.",
                "It John was who solved the problem.",
                "What was John who solved the problem.",
                "It was John where solved the problem."
            ],
            answer: "It was John who solved the problem.",
            explanation: "Pola benar: It was + person + who + clause."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "What I need is more time.",
                "What need I is more time.",
                "What I need are more time.",
                "That I need is more time."
            ],
            answer: "What I need is more time.",
            explanation: "What-cleft memakai statement order dan be verb yang sesuai."
        }
    ]
},

"parallel-structure": {
    title: "Parallel Structure",
    description: "Parallel Structure adalah pola kalimat yang menggunakan bentuk grammar yang sama untuk elemen-elemen yang setara. Struktur ini membuat kalimat lebih rapi, seimbang, dan mudah dipahami.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Same Function = Same Form
    `,

    notes: [
        "Gunakan bentuk grammar yang sama untuk item dalam daftar.",
        "Parallel structure sering muncul dalam list, comparison, dan paired conjunction.",
        "Jika item pertama berbentuk gerund, item berikutnya sebaiknya juga gerund.",
        "Jika item pertama berbentuk infinitive, item berikutnya sebaiknya juga infinitive.",
        "Parallel structure penting dalam academic writing dan formal English.",
        "Kesalahan parallel structure sering muncul dalam TOEFL dan IELTS writing."
    ],

    patterns: [
        {
            group: "List Parallelism",
            items: [
                {
                    label: "Gerund List",
                    formula: "V-ing, V-ing, and V-ing",
                    examples: [
                        "She enjoys reading, writing, and speaking.",
                        "Learning, practicing, and reviewing are important.",
                        "He likes swimming, cycling, and running."
                    ]
                },
                {
                    label: "Adjective List",
                    formula: "adjective, adjective, and adjective",
                    examples: [
                        "The course is useful, practical, and affordable.",
                        "She is smart, diligent, and creative.",
                        "The room was clean, bright, and comfortable."
                    ]
                }
            ]
        },
        {
            group: "Infinitive Parallelism",
            items: [
                {
                    label: "To + V1",
                    formula: "to + V1, to + V1, and to + V1",
                    examples: [
                        "I want to learn, to practice, and to improve.",
                        "The goal is to read, to write, and to speak fluently.",
                        "She plans to study, to work, and to travel."
                    ]
                }
            ]
        },
        {
            group: "Paired Conjunctions",
            items: [
                {
                    label: "Both / Not Only",
                    formula: "both X and Y / not only X but also Y",
                    examples: [
                        "She is both intelligent and hardworking.",
                        "He not only speaks English but also writes it well.",
                        "The app is not only useful but also easy to use."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Gerund",
            question: "She enjoys reading, writing, and ___.",
            options: ["speaking", "to speak", "speaks", "spoke"],
            answer: "speaking",
            explanation: "Reading dan writing berbentuk gerund, jadi item berikutnya juga gerund."
        },
        {
            type: "Gerund",
            question: "He likes swimming, cycling, and ___.",
            options: ["running", "to run", "runs", "ran"],
            answer: "running",
            explanation: "Semua item harus memakai bentuk V-ing."
        },
        {
            type: "Adjective",
            question: "The course is useful, practical, and ___.",
            options: ["affordable", "afford", "affording", "to afford"],
            answer: "affordable",
            explanation: "Useful dan practical adalah adjective, jadi gunakan adjective affordable."
        },
        {
            type: "Infinitive",
            question: "She plans to study, to work, and ___.",
            options: ["to travel", "traveling", "travels", "traveled"],
            answer: "to travel",
            explanation: "Pola paralelnya adalah to + V1."
        },
        {
            type: "Both And",
            question: "She is both intelligent and ___.",
            options: ["hardworking", "works hard", "to work hard", "worked hard"],
            answer: "hardworking",
            explanation: "Both X and Y harus memakai bentuk yang setara."
        },
        {
            type: "Not Only",
            question: "The app is not only useful but also ___.",
            options: ["easy to use", "using easily", "use it easy", "to use easily it"],
            answer: "easy to use",
            explanation: "Useful dan easy to use sama-sama adjective phrase."
        },
        {
            type: "Error Check",
            question: "Which sentence has correct parallel structure?",
            options: [
                "She likes reading, writing, and speaking.",
                "She likes reading, writing, and to speak.",
                "She likes to read, writing, and speaks.",
                "She likes reads, writing, and speaking."
            ],
            answer: "She likes reading, writing, and speaking.",
            explanation: "Semua item memakai gerund."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "The room was clean, bright, and comfortable.",
                "The room was clean, brightly, and comfort.",
                "The room was cleaning, bright, and to comfort.",
                "The room was clean, brightness, and comfortable."
            ],
            answer: "The room was clean, bright, and comfortable.",
            explanation: "Semua item adalah adjective."
        },
        {
            type: "Concept",
            question: "Parallel structure means...",
            options: [
                "using the same grammatical form for equal ideas",
                "using random verb forms",
                "using only long sentences",
                "removing all conjunctions"
            ],
            answer: "using the same grammatical form for equal ideas",
            explanation: "Parallel structure menjaga elemen setara dalam bentuk grammar yang sama."
        },
        {
            type: "Final",
            question: "Which sentence is best for formal writing?",
            options: [
                "The policy is clear, logical, and effective.",
                "The policy is clear, logically, and effectiveness.",
                "The policy is clearly, logic, and effective.",
                "The policy is clarity, logical, and effect."
            ],
            answer: "The policy is clear, logical, and effective.",
            explanation: "Clear, logical, dan effective semuanya adjective."
        }
    ]
},

"ellipsis": {
    title: "Ellipsis",
    description: "Ellipsis adalah penghilangan kata yang sudah jelas dari konteks agar kalimat menjadi lebih ringkas, natural, dan tidak repetitif. Ellipsis sering digunakan dalam comparison, coordination, response pendek, dan formal writing.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Full Form → Shortened Form<br>
        Repeated words can be omitted when the meaning is clear.
    `,

    notes: [
        "Ellipsis menghilangkan kata yang tidak perlu diulang.",
        "Makna kalimat tetap harus jelas.",
        "Ellipsis sering muncul dalam kalimat dengan and, but, or.",
        "Ellipsis juga umum dalam comparison menggunakan than atau as.",
        "Dalam response pendek, auxiliary sering dipertahankan.",
        "Ellipsis membuat tulisan lebih ringkas dan natural."
    ],

    patterns: [
        {
            group: "Coordinate Ellipsis",
            items: [
                {
                    label: "Same Subject",
                    formula: "Subject + Verb + Object and + Verb + Object",
                    examples: [
                        "Full: She opened the door and she entered the room.",
                        "Ellipsis: She opened the door and entered the room.",
                        "Full: He bought a book and he read it.",
                        "Ellipsis: He bought a book and read it."
                    ]
                },
                {
                    label: "Same Verb",
                    formula: "Subject + Verb + Object and Subject + Object",
                    examples: [
                        "Full: Rina likes tea and Budi likes coffee.",
                        "Ellipsis: Rina likes tea and Budi coffee.",
                        "Full: She chose the red dress and I chose the blue one.",
                        "Ellipsis: She chose the red dress and I the blue one."
                    ]
                }
            ]
        },
        {
            group: "Comparison Ellipsis",
            items: [
                {
                    label: "Than / As",
                    formula: "Comparison + omitted repeated words",
                    examples: [
                        "Full: She is taller than I am tall.",
                        "Ellipsis: She is taller than I am.",
                        "Full: He works harder than I work.",
                        "Ellipsis: He works harder than I do."
                    ]
                }
            ]
        },
        {
            group: "Short Responses",
            items: [
                {
                    label: "Auxiliary Response",
                    formula: "Subject + auxiliary",
                    examples: [
                        "A: Can you swim? B: Yes, I can.",
                        "A: Did she call? B: No, she didn't.",
                        "A: Are they ready? B: Yes, they are."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Coordinate",
            question: "Choose the best ellipsis: She opened the door and she entered the room.",
            options: [
                "She opened the door and entered the room.",
                "She opened and she entered the room.",
                "She door and entered.",
                "Opened the door and she entered."
            ],
            answer: "She opened the door and entered the room.",
            explanation: "Subject she tidak perlu diulang karena subject-nya sama."
        },
        {
            type: "Coordinate",
            question: "He bought a book and he read it.",
            options: [
                "He bought a book and read it.",
                "He bought and he read it.",
                "He bought a book and he.",
                "Bought a book and read it he."
            ],
            answer: "He bought a book and read it.",
            explanation: "Subject he di clause kedua dapat dihilangkan."
        },
        {
            type: "Comparison",
            question: "She is taller than I ___.",
            options: ["am", "do", "was", "have"],
            answer: "am",
            explanation: "Dalam comparison dengan be, auxiliary be dipertahankan."
        },
        {
            type: "Comparison",
            question: "He works harder than I ___.",
            options: ["do", "am", "have", "was"],
            answer: "do",
            explanation: "Works digantikan oleh auxiliary do."
        },
        {
            type: "Short Response",
            question: "A: Can you swim? B: Yes, I ___.",
            options: ["can", "do", "am", "have"],
            answer: "can",
            explanation: "Gunakan auxiliary yang sama dengan pertanyaan."
        },
        {
            type: "Short Response",
            question: "A: Did she call? B: No, she ___.",
            options: ["didn't", "doesn't", "isn't", "hasn't"],
            answer: "didn't",
            explanation: "Pertanyaan memakai did, jadi jawabannya memakai did/didn't."
        },
        {
            type: "Short Response",
            question: "A: Are they ready? B: Yes, they ___.",
            options: ["are", "do", "did", "have"],
            answer: "are",
            explanation: "Pertanyaan memakai are, jadi response pendek memakai are."
        },
        {
            type: "Concept",
            question: "Ellipsis is used to avoid...",
            options: [
                "unnecessary repetition",
                "all grammar rules",
                "all punctuation",
                "all subjects"
            ],
            answer: "unnecessary repetition",
            explanation: "Ellipsis menghilangkan pengulangan yang tidak perlu."
        },
        {
            type: "Concept",
            question: "Ellipsis is correct only when...",
            options: [
                "the meaning remains clear",
                "all verbs are removed",
                "the sentence becomes confusing",
                "there is no subject"
            ],
            answer: "the meaning remains clear",
            explanation: "Kata boleh dihilangkan hanya jika makna tetap jelas."
        },
        {
            type: "Error Check",
            question: "Which sentence uses ellipsis naturally?",
            options: [
                "She likes coffee, and I tea.",
                "She likes coffee, and I likes tea.",
                "She likes coffee, and tea I.",
                "She coffee, and I tea likes."
            ],
            answer: "She likes coffee, and I tea.",
            explanation: "Verb likes dapat dihilangkan pada clause kedua karena sudah jelas dari konteks."
        }
    ]
},

"fronting": {
    title: "Fronting & Topicalization",
    description: "Fronting adalah pola kalimat ketika bagian tertentu dipindahkan ke awal kalimat untuk memberi penekanan, variasi gaya, atau menghubungkan ide dengan kalimat sebelumnya. Topicalization adalah bentuk fronting yang menjadikan suatu informasi sebagai topik utama kalimat.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Normal: Subject + Verb + Object/Adverbial<br>
        Fronting: Object/Adverbial + Subject + Verb
    `,

    notes: [
        "Fronting digunakan untuk memberi penekanan pada informasi tertentu.",
        "Bagian yang dipindahkan ke awal bisa berupa object, adverbial phrase, complement, atau negative expression.",
        "Fronting sering digunakan dalam writing agar kalimat tidak monoton.",
        "Tidak semua fronting membutuhkan inversion.",
        "Jika fronting memakai negative adverbial, biasanya terjadi inversion.",
        "Topicalization membantu pembaca melihat topik utama kalimat sejak awal."
    ],

    patterns: [
        {
            group: "Object Fronting",
            items: [
                {
                    label: "Object as Topic",
                    formula: "Object + Subject + Verb",
                    examples: [
                        "Normal: I understand this problem.",
                        "Fronting: This problem, I understand.",
                        "Normal: She can solve difficult questions.",
                        "Fronting: Difficult questions, she can solve."
                    ]
                }
            ]
        },
        {
            group: "Adverbial Fronting",
            items: [
                {
                    label: "Place / Time First",
                    formula: "Adverbial + Subject + Verb",
                    examples: [
                        "Normal: The children played in the garden.",
                        "Fronting: In the garden, the children played.",
                        "Normal: We met after the meeting.",
                        "Fronting: After the meeting, we met."
                    ]
                }
            ]
        },
        {
            group: "Negative Fronting",
            items: [
                {
                    label: "With Inversion",
                    formula: "Negative Expression + Auxiliary + Subject + Verb",
                    examples: [
                        "Normal: I had never seen such beauty.",
                        "Fronting: Never had I seen such beauty.",
                        "Normal: She rarely speaks in public.",
                        "Fronting: Rarely does she speak in public."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Fronting means moving an element to...",
            options: [
                "the beginning of the sentence",
                "the end of the sentence only",
                "the middle of a word",
                "after every verb"
            ],
            answer: "the beginning of the sentence",
            explanation: "Fronting memindahkan bagian tertentu ke awal kalimat."
        },
        {
            type: "Object Fronting",
            question: "Normal: I understand this problem. Fronting:",
            options: [
                "This problem, I understand.",
                "Understand this problem, I.",
                "This problem understand I.",
                "I this problem understand."
            ],
            answer: "This problem, I understand.",
            explanation: "Object this problem dipindahkan ke awal sebagai topik."
        },
        {
            type: "Object Fronting",
            question: "Normal: She can solve difficult questions. Fronting:",
            options: [
                "Difficult questions, she can solve.",
                "Difficult questions can she solve.",
                "She difficult questions can solve.",
                "Can solve difficult questions she."
            ],
            answer: "Difficult questions, she can solve.",
            explanation: "Object dipindahkan ke awal tanpa inversion."
        },
        {
            type: "Adverbial",
            question: "Normal: The children played in the garden. Fronting:",
            options: [
                "In the garden, the children played.",
                "In the garden played the children always.",
                "The garden in, the children played.",
                "Played in the garden the children."
            ],
            answer: "In the garden, the children played.",
            explanation: "Adverbial place dipindahkan ke awal."
        },
        {
            type: "Adverbial",
            question: "Normal: We met after the meeting. Fronting:",
            options: [
                "After the meeting, we met.",
                "After the meeting met we.",
                "We after the meeting met.",
                "Meeting after, we met."
            ],
            answer: "After the meeting, we met.",
            explanation: "Adverbial time dipindahkan ke awal."
        },
        {
            type: "Negative Fronting",
            question: "Never ___ I seen such beauty.",
            options: ["had", "have", "do", "does"],
            answer: "had",
            explanation: "Negative fronting memicu inversion."
        },
        {
            type: "Negative Fronting",
            question: "Rarely ___ she speak in public.",
            options: ["does", "do", "did", "has"],
            answer: "does",
            explanation: "Rarely di awal memicu inversion dengan does."
        },
        {
            type: "Concept",
            question: "Does every type of fronting require inversion?",
            options: [
                "No",
                "Yes",
                "Only with nouns",
                "Only with articles"
            ],
            answer: "No",
            explanation: "Object/adverbial fronting biasanya tidak butuh inversion, tetapi negative fronting membutuhkan inversion."
        },
        {
            type: "Concept",
            question: "Topicalization helps make information become...",
            options: [
                "the topic of the sentence",
                "a plural noun",
                "an article",
                "a contraction"
            ],
            answer: "the topic of the sentence",
            explanation: "Topicalization menempatkan informasi sebagai topik utama."
        },
        {
            type: "Error Check",
            question: "Which sentence uses fronting naturally?",
            options: [
                "This issue, we must discuss today.",
                "This issue must we discuss today.",
                "This issue discuss we today.",
                "This issue today discuss must we."
            ],
            answer: "This issue, we must discuss today.",
            explanation: "Object fronting tidak membutuhkan inversion."
        }
    ]
},

"discourse-markers": {
    title: "Discourse Markers",
    description: "Discourse Markers adalah kata atau frasa penghubung yang digunakan untuk mengatur hubungan antaride dalam kalimat atau paragraf. Discourse markers membantu tulisan menjadi lebih logis, runtut, dan akademik.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Idea 1 + Discourse Marker + Idea 2
    `,

    notes: [
        "Discourse markers digunakan untuk menghubungkan ide.",
        "However digunakan untuk kontras.",
        "Therefore digunakan untuk hasil atau kesimpulan.",
        "Moreover digunakan untuk menambahkan informasi.",
        "For example digunakan untuk memberi contoh.",
        "In contrast digunakan untuk menunjukkan perbedaan.",
        "In conclusion digunakan untuk menutup pembahasan.",
        "Discourse markers sangat penting dalam academic writing."
    ],

    patterns: [
        {
            group: "Addition",
            items: [
                {
                    label: "Moreover / Furthermore",
                    formula: "Idea 1. Moreover/Furthermore, Idea 2.",
                    examples: [
                        "The method is simple. Moreover, it is effective.",
                        "The app is useful. Furthermore, it is easy to use.",
                        "English improves communication. Moreover, it opens career opportunities."
                    ]
                }
            ]
        },
        {
            group: "Contrast",
            items: [
                {
                    label: "However / In Contrast",
                    formula: "Idea 1. However/In contrast, Idea 2.",
                    examples: [
                        "The task was difficult. However, we completed it.",
                        "City life is convenient. In contrast, village life is peaceful.",
                        "The product is expensive. However, its quality is excellent."
                    ]
                }
            ]
        },
        {
            group: "Result",
            items: [
                {
                    label: "Therefore / As a Result",
                    formula: "Idea 1. Therefore/As a result, Idea 2.",
                    examples: [
                        "The data was incomplete. Therefore, the report was delayed.",
                        "He practiced every day. As a result, he improved quickly.",
                        "The demand increased. Therefore, the company expanded production."
                    ]
                }
            ]
        },
        {
            group: "Example / Conclusion",
            items: [
                {
                    label: "For Example / In Conclusion",
                    formula: "Marker + explanation",
                    examples: [
                        "Many skills are useful. For example, communication is essential.",
                        "In conclusion, grammar accuracy improves writing quality.",
                        "Several factors affect learning. For example, motivation plays a major role."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Addition",
            question: "The app is useful. ___, it is easy to use.",
            options: ["Moreover", "However", "Although", "Unless"],
            answer: "Moreover",
            explanation: "Moreover digunakan untuk menambahkan informasi."
        },
        {
            type: "Addition",
            question: "English improves communication. ___, it opens career opportunities.",
            options: ["Furthermore", "In contrast", "Because", "Unless"],
            answer: "Furthermore",
            explanation: "Furthermore digunakan untuk tambahan ide."
        },
        {
            type: "Contrast",
            question: "The task was difficult. ___, we completed it.",
            options: ["However", "Therefore", "Moreover", "For example"],
            answer: "However",
            explanation: "However menunjukkan kontras."
        },
        {
            type: "Contrast",
            question: "City life is convenient. ___, village life is peaceful.",
            options: ["In contrast", "Therefore", "Moreover", "As a result"],
            answer: "In contrast",
            explanation: "In contrast menunjukkan perbedaan."
        },
        {
            type: "Result",
            question: "The data was incomplete. ___, the report was delayed.",
            options: ["Therefore", "However", "Moreover", "For example"],
            answer: "Therefore",
            explanation: "Therefore menunjukkan hasil atau akibat."
        },
        {
            type: "Result",
            question: "He practiced every day. ___, he improved quickly.",
            options: ["As a result", "However", "In contrast", "Although"],
            answer: "As a result",
            explanation: "As a result menunjukkan akibat."
        },
        {
            type: "Example",
            question: "Many skills are useful. ___, communication is essential.",
            options: ["For example", "However", "Therefore", "In conclusion"],
            answer: "For example",
            explanation: "For example digunakan untuk memberi contoh."
        },
        {
            type: "Conclusion",
            question: "___, grammar accuracy improves writing quality.",
            options: ["In conclusion", "However", "For example", "Moreover"],
            answer: "In conclusion",
            explanation: "In conclusion digunakan untuk menutup pembahasan."
        },
        {
            type: "Concept",
            question: "Discourse markers are used to...",
            options: [
                "connect ideas logically",
                "make plural nouns",
                "replace all verbs",
                "remove punctuation"
            ],
            answer: "connect ideas logically",
            explanation: "Discourse markers menghubungkan ide secara logis."
        },
        {
            type: "Error Check",
            question: "Which marker shows contrast?",
            options: [
                "However",
                "Moreover",
                "Therefore",
                "For example"
            ],
            answer: "However",
            explanation: "However digunakan untuk menunjukkan pertentangan atau kontras."
        }
    ]
},

"advanced-review": {
    title: "Advanced Sentence Review",
    description: "Review akhir untuk menguji seluruh materi Advanced Sentence Patterns: cleft sentences, parallel structure, ellipsis, fronting, topicalization, dan discourse markers.",

    formula: `
        <strong>Ringkasan BAB 16:</strong><br>
        Cleft Sentence = emphasis<br>
        Parallel Structure = same form<br>
        Ellipsis = omit repeated words<br>
        Fronting = move important element to the beginning<br>
        Discourse Markers = logical connection
    `,

    notes: [
        "Cleft sentence digunakan untuk memberi penekanan.",
        "Parallel structure menjaga bentuk grammar tetap sejajar.",
        "Ellipsis menghilangkan pengulangan yang tidak perlu.",
        "Fronting memindahkan informasi penting ke awal kalimat.",
        "Discourse markers menghubungkan ide secara logis.",
        "Pola advanced sentence sangat penting untuk academic writing dan formal English."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Emphasis",
                    formula: "It is/was + focus + who/that + clause",
                    examples: [
                        "It was John who solved the problem.",
                        "What I need is more time.",
                        "It was yesterday that I met him."
                    ]
                },
                {
                    label: "Parallel / Ellipsis",
                    formula: "same form / omitted repeated words",
                    examples: [
                        "She likes reading, writing, and speaking.",
                        "He bought a book and read it.",
                        "She is taller than I am."
                    ]
                },
                {
                    label: "Fronting / Discourse",
                    formula: "fronted element + clause / marker + idea",
                    examples: [
                        "This problem, I understand.",
                        "After the meeting, we discussed the issue.",
                        "The task was difficult. However, we completed it."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Cleft",
            question: "___ John who solved the problem.",
            options: ["It was", "What was", "There was", "That was"],
            answer: "It was",
            explanation: "It-cleft memakai It is/was + focus + who/that."
        },
        {
            type: "Cleft",
            question: "What I need ___ more time.",
            options: ["is", "are", "be", "were"],
            answer: "is",
            explanation: "What-cleft memakai what + clause + be + focus."
        },
        {
            type: "Parallel",
            question: "She likes reading, writing, and ___.",
            options: ["speaking", "to speak", "speaks", "spoke"],
            answer: "speaking",
            explanation: "Semua item harus berbentuk gerund."
        },
        {
            type: "Parallel",
            question: "The policy is clear, logical, and ___.",
            options: ["effective", "effectively", "effect", "to effect"],
            answer: "effective",
            explanation: "Clear dan logical adalah adjective, jadi gunakan effective."
        },
        {
            type: "Ellipsis",
            question: "He bought a book and ___ it.",
            options: ["read", "reads", "reading", "to read"],
            answer: "read",
            explanation: "Subject he tidak perlu diulang: He bought a book and read it."
        },
        {
            type: "Ellipsis",
            question: "She is taller than I ___.",
            options: ["am", "do", "have", "was"],
            answer: "am",
            explanation: "Dalam comparison dengan be, gunakan auxiliary be."
        },
        {
            type: "Short Response",
            question: "A: Can you swim? B: Yes, I ___.",
            options: ["can", "do", "am", "have"],
            answer: "can",
            explanation: "Short response memakai auxiliary yang sama."
        },
        {
            type: "Fronting",
            question: "Normal: I understand this problem. Fronting:",
            options: [
                "This problem, I understand.",
                "This problem understand I.",
                "Understand this problem, I.",
                "I this problem understand."
            ],
            answer: "This problem, I understand.",
            explanation: "Object dipindahkan ke awal sebagai topik."
        },
        {
            type: "Fronting",
            question: "Normal: The children played in the garden. Fronting:",
            options: [
                "In the garden, the children played.",
                "In the garden played the children always.",
                "The garden in, the children played.",
                "Played in the garden the children."
            ],
            answer: "In the garden, the children played.",
            explanation: "Adverbial place dipindahkan ke awal."
        },
        {
            type: "Negative Fronting",
            question: "Never ___ I seen such beauty.",
            options: ["had", "have", "do", "does"],
            answer: "had",
            explanation: "Negative fronting memicu inversion."
        },
        {
            type: "Discourse",
            question: "The task was difficult. ___, we completed it.",
            options: ["However", "Therefore", "Moreover", "For example"],
            answer: "However",
            explanation: "However menunjukkan kontras."
        },
        {
            type: "Discourse",
            question: "The data was incomplete. ___, the report was delayed.",
            options: ["Therefore", "However", "Moreover", "For example"],
            answer: "Therefore",
            explanation: "Therefore menunjukkan akibat."
        },
        {
            type: "Discourse",
            question: "The app is useful. ___, it is easy to use.",
            options: ["Moreover", "However", "Although", "Unless"],
            answer: "Moreover",
            explanation: "Moreover menambahkan informasi."
        },
        {
            type: "Discourse",
            question: "Many skills are useful. ___, communication is essential.",
            options: ["For example", "However", "Therefore", "In conclusion"],
            answer: "For example",
            explanation: "For example digunakan untuk memberi contoh."
        },
        {
            type: "Concept",
            question: "Cleft sentences are used for...",
            options: ["emphasis", "plural nouns", "articles", "prepositions only"],
            answer: "emphasis",
            explanation: "Cleft sentence memberi penekanan."
        },
        {
            type: "Concept",
            question: "Parallel structure means...",
            options: [
                "using the same grammatical form for equal ideas",
                "using random verb forms",
                "using only nouns",
                "removing all conjunctions"
            ],
            answer: "using the same grammatical form for equal ideas",
            explanation: "Parallel structure menjaga elemen setara tetap seimbang."
        },
        {
            type: "Concept",
            question: "Ellipsis removes...",
            options: [
                "unnecessary repetition",
                "all verbs",
                "all punctuation",
                "all grammar rules"
            ],
            answer: "unnecessary repetition",
            explanation: "Ellipsis menghilangkan bagian yang sudah jelas dari konteks."
        },
        {
            type: "Concept",
            question: "Fronting moves information to...",
            options: [
                "the beginning of the sentence",
                "the end only",
                "the middle of a word",
                "after every noun"
            ],
            answer: "the beginning of the sentence",
            explanation: "Fronting memindahkan elemen penting ke awal kalimat."
        },
        {
            type: "Concept",
            question: "Discourse markers are used to...",
            options: [
                "connect ideas logically",
                "make plural nouns",
                "replace all verbs",
                "remove subjects"
            ],
            answer: "connect ideas logically",
            explanation: "Discourse markers menghubungkan ide secara logis."
        },
        {
            type: "Final",
            question: "Which sentence is best for formal writing?",
            options: [
                "The method is simple; however, it is effective.",
                "The method is simple however it effective.",
                "The method simple, however, effective.",
                "Method is simple however effective it."
            ],
            answer: "The method is simple; however, it is effective.",
            explanation: "Kalimat memakai semicolon, discourse marker, dan struktur formal yang benar."
        }
    ]
},

"advanced-review": {
    title: "Advanced Sentence Review",
    description: "Review akhir untuk menguji seluruh materi Advanced Sentence Patterns: cleft sentence, parallel structure, ellipsis, fronting, dan discourse markers.",

    formula: `
        <strong>Ringkasan BAB 16:</strong><br>
        Cleft = emphasis<br>
        Parallel = same form<br>
        Ellipsis = remove repetition<br>
        Fronting = move focus to beginning<br>
        Discourse Marker = connect ideas
    `,

    notes: [
        "Cleft sentence digunakan untuk penekanan.",
        "Parallel structure memakai bentuk grammar yang sama untuk ide setara.",
        "Ellipsis menghilangkan pengulangan yang tidak perlu.",
        "Fronting memindahkan elemen penting ke awal kalimat.",
        "Discourse markers menghubungkan ide secara logis.",
        "Advanced sentence patterns membuat writing lebih formal, jelas, dan akademik."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Emphasis",
                    formula: "It is/was + focus + who/that + clause",
                    examples: [
                        "It was John who solved the problem.",
                        "What I need is more time."
                    ]
                },
                {
                    label: "Parallel & Ellipsis",
                    formula: "same form / omitted repetition",
                    examples: [
                        "She likes reading, writing, and speaking.",
                        "She opened the door and entered the room."
                    ]
                },
                {
                    label: "Fronting & Markers",
                    formula: "fronted element / logical connector",
                    examples: [
                        "This problem, I understand.",
                        "The task was difficult. However, we completed it."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Cleft",
            question: "___ John who solved the problem.",
            options: ["It was", "What was", "There was", "That was"],
            answer: "It was",
            explanation: "It-cleft memakai It is/was + focus + who/that."
        },
        {
            type: "Cleft",
            question: "It was Rina ___ called you yesterday.",
            options: ["who", "where", "when", "whose"],
            answer: "who",
            explanation: "Who digunakan jika focus adalah orang."
        },
        {
            type: "Cleft",
            question: "___ I need is more time.",
            options: ["What", "That", "Where", "When"],
            answer: "What",
            explanation: "What-cleft memakai What + clause + be + focus."
        },
        {
            type: "Parallel",
            question: "She enjoys reading, writing, and ___.",
            options: ["speaking", "to speak", "speaks", "spoke"],
            answer: "speaking",
            explanation: "Semua item harus berbentuk gerund."
        },
        {
            type: "Parallel",
            question: "The policy is clear, logical, and ___.",
            options: ["effective", "effectively", "effectiveness", "effect"],
            answer: "effective",
            explanation: "Clear dan logical adalah adjective, jadi gunakan effective."
        },
        {
            type: "Ellipsis",
            question: "Best ellipsis: She opened the door and she entered the room.",
            options: [
                "She opened the door and entered the room.",
                "She opened and she entered the room.",
                "She door and entered.",
                "Opened the door and she entered."
            ],
            answer: "She opened the door and entered the room.",
            explanation: "Subject she tidak perlu diulang."
        },
        {
            type: "Ellipsis",
            question: "He works harder than I ___.",
            options: ["do", "am", "have", "was"],
            answer: "do",
            explanation: "Works digantikan oleh auxiliary do."
        },
        {
            type: "Fronting",
            question: "Normal: I understand this problem. Fronting:",
            options: [
                "This problem, I understand.",
                "Understand this problem, I.",
                "This problem understand I.",
                "I this problem understand."
            ],
            answer: "This problem, I understand.",
            explanation: "Object dipindahkan ke awal sebagai topik."
        },
        {
            type: "Fronting",
            question: "Normal: The children played in the garden. Fronting:",
            options: [
                "In the garden, the children played.",
                "In the garden played the children always.",
                "The garden in, the children played.",
                "Played in the garden the children."
            ],
            answer: "In the garden, the children played.",
            explanation: "Adverbial place dipindahkan ke awal."
        },
        {
            type: "Discourse Marker",
            question: "The task was difficult. ___, we completed it.",
            options: ["However", "Therefore", "Moreover", "For example"],
            answer: "However",
            explanation: "However menunjukkan kontras."
        },
        {
            type: "Discourse Marker",
            question: "The data was incomplete. ___, the report was delayed.",
            options: ["Therefore", "However", "Moreover", "For example"],
            answer: "Therefore",
            explanation: "Therefore menunjukkan akibat."
        },
        {
            type: "Discourse Marker",
            question: "The app is useful. ___, it is easy to use.",
            options: ["Moreover", "However", "Although", "Unless"],
            answer: "Moreover",
            explanation: "Moreover menambahkan informasi."
        },
        {
            type: "Concept",
            question: "Cleft sentences are used for...",
            options: ["emphasis", "plural nouns", "articles", "basic spelling"],
            answer: "emphasis",
            explanation: "Cleft sentence memberi penekanan."
        },
        {
            type: "Concept",
            question: "Parallel structure means...",
            options: [
                "using the same grammatical form for equal ideas",
                "using random verb forms",
                "removing all verbs",
                "using only nouns"
            ],
            answer: "using the same grammatical form for equal ideas",
            explanation: "Parallel structure menjaga bentuk grammar tetap seimbang."
        },
        {
            type: "Concept",
            question: "Ellipsis is used to avoid...",
            options: ["unnecessary repetition", "all grammar rules", "all punctuation", "all subjects"],
            answer: "unnecessary repetition",
            explanation: "Ellipsis menghilangkan pengulangan yang tidak perlu."
        },
        {
            type: "Concept",
            question: "Fronting moves information to...",
            options: ["the beginning of the sentence", "the end only", "the middle only", "nowhere"],
            answer: "the beginning of the sentence",
            explanation: "Fronting memindahkan elemen penting ke awal kalimat."
        },
        {
            type: "Concept",
            question: "Discourse markers are used to...",
            options: [
                "connect ideas logically",
                "make plural nouns",
                "replace all verbs",
                "remove punctuation"
            ],
            answer: "connect ideas logically",
            explanation: "Discourse markers menghubungkan ide secara logis."
        },
        {
            type: "Error Check",
            question: "Which sentence has correct parallel structure?",
            options: [
                "She likes reading, writing, and speaking.",
                "She likes reading, writing, and to speak.",
                "She likes read, writing, and to speak.",
                "She likes reads, wrote, and speaking."
            ],
            answer: "She likes reading, writing, and speaking.",
            explanation: "Semua item memakai bentuk V-ing."
        },
        {
            type: "Error Check",
            question: "Which sentence uses fronting naturally?",
            options: [
                "This issue, we must discuss today.",
                "This issue must we discuss today.",
                "This issue discuss we today.",
                "This issue today discuss must we."
            ],
            answer: "This issue, we must discuss today.",
            explanation: "Object fronting tidak membutuhkan inversion."
        },
        {
            type: "Final",
            question: "Which sentence is best for academic writing?",
            options: [
                "The method is simple. Moreover, it is effective.",
                "The method simple moreover effective.",
                "Moreover the method, is simple effective.",
                "The method is simple, moreover it effective."
            ],
            answer: "The method is simple. Moreover, it is effective.",
            explanation: "Discourse marker digunakan dengan punctuation dan struktur yang tepat."
        }
    ]
},

"phrasal-verbs": {
    title: "Introduction to Phrasal Verbs",
    description: "Phrasal Verb adalah gabungan antara verb dan particle seperti up, out, off, on, in, atau over. Gabungan ini sering menghasilkan makna baru yang berbeda dari arti verb aslinya.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + Particle<br>
        Verb + Particle + Object
    `,

    notes: [
        "Phrasal verb terdiri dari verb dan particle.",
        "Particle bisa berupa adverb atau preposition seperti up, out, off, on, in, over.",
        "Makna phrasal verb sering tidak bisa ditebak dari arti kata per kata.",
        "Phrasal verb sangat umum dalam percakapan sehari-hari.",
        "Beberapa phrasal verb dapat dipisah oleh object.",
        "Beberapa phrasal verb tidak dapat dipisah.",
        "Dalam writing formal, phrasal verb sering diganti dengan single-word verb yang lebih akademik."
    ],

    patterns: [
        {
            group: "Basic Form",
            items: [
                {
                    label: "Verb + Particle",
                    formula: "Verb + particle",
                    examples: [
                        "wake up",
                        "go out",
                        "sit down",
                        "come in"
                    ]
                },
                {
                    label: "Verb + Particle + Object",
                    formula: "Verb + particle + object",
                    examples: [
                        "turn off the light",
                        "look after the baby",
                        "pick up the phone",
                        "fill out the form"
                    ]
                }
            ]
        },
        {
            group: "Meaning",
            items: [
                {
                    label: "Literal Meaning",
                    formula: "Meaning can be physical/direct",
                    examples: [
                        "She sat down.",
                        "He stood up.",
                        "They went out."
                    ]
                },
                {
                    label: "Idiomatic Meaning",
                    formula: "Meaning is not literal",
                    examples: [
                        "She gave up smoking.",
                        "He ran out of money.",
                        "They broke up last year."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A phrasal verb is usually formed by...",
            options: [
                "verb + particle",
                "noun + article",
                "adjective + noun",
                "pronoun + determiner"
            ],
            answer: "verb + particle",
            explanation: "Phrasal verb terbentuk dari verb dan particle."
        },
        {
            type: "Particle",
            question: "Which word can be a particle in a phrasal verb?",
            options: ["up", "beautiful", "student", "quickly only"],
            answer: "up",
            explanation: "Up sering menjadi particle dalam phrasal verb."
        },
        {
            type: "Meaning",
            question: "What does 'give up' usually mean?",
            options: ["stop trying", "stand up", "go outside", "write down"],
            answer: "stop trying",
            explanation: "Give up berarti berhenti mencoba atau menyerah."
        },
        {
            type: "Meaning",
            question: "What does 'run out of money' mean?",
            options: [
                "have no money left",
                "run with money",
                "find money",
                "save money"
            ],
            answer: "have no money left",
            explanation: "Run out of berarti kehabisan."
        },
        {
            type: "Basic",
            question: "Choose the phrasal verb.",
            options: ["wake up", "beautiful house", "very quickly", "the student"],
            answer: "wake up",
            explanation: "Wake up terdiri dari verb wake dan particle up."
        },
        {
            type: "Object",
            question: "Please turn ___ the light.",
            options: ["off", "beautiful", "student", "quick"],
            answer: "off",
            explanation: "Turn off berarti mematikan."
        },
        {
            type: "Object",
            question: "She looks ___ her little brother.",
            options: ["after", "beautiful", "student", "quickly"],
            answer: "after",
            explanation: "Look after berarti menjaga atau merawat."
        },
        {
            type: "Literal",
            question: "Which phrasal verb has a literal physical meaning?",
            options: ["sit down", "give up", "break up", "run out of"],
            answer: "sit down",
            explanation: "Sit down memiliki makna fisik langsung."
        },
        {
            type: "Idiomatic",
            question: "Which phrasal verb has an idiomatic meaning?",
            options: ["give up", "sit down", "stand up", "come in"],
            answer: "give up",
            explanation: "Give up bermakna idiomatik, yaitu menyerah."
        },
        {
            type: "Formal",
            question: "In formal writing, phrasal verbs are often replaced by...",
            options: [
                "single-word verbs",
                "random adjectives",
                "articles only",
                "plural nouns"
            ],
            answer: "single-word verbs",
            explanation: "Dalam formal writing, phrasal verb sering diganti dengan verb yang lebih akademik."
        }
    ]
},

"separable-phrasal-verbs": {
    title: "Separable Phrasal Verbs",
    description: "Separable Phrasal Verbs adalah phrasal verb yang object-nya bisa diletakkan di antara verb dan particle. Jika object berupa pronoun, object harus diletakkan di tengah.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + Particle + Object<br>
        Verb + Object + Particle<br>
        Pronoun Object wajib di tengah
    `,

    notes: [
        "Separable phrasal verb dapat dipisah oleh object.",
        "Object noun bisa diletakkan setelah particle atau di antara verb dan particle.",
        "Object pronoun harus diletakkan di antara verb dan particle.",
        "Contoh umum: turn off, pick up, put on, take off, write down, fill out.",
        "Jangan letakkan pronoun setelah particle pada separable phrasal verb."
    ],

    patterns: [
        {
            group: "Noun Object",
            items: [
                {
                    label: "Two Positions",
                    formula: "Verb + particle + noun / Verb + noun + particle",
                    examples: [
                        "Turn off the light.",
                        "Turn the light off.",
                        "Pick up the phone.",
                        "Pick the phone up."
                    ]
                }
            ]
        },
        {
            group: "Pronoun Object",
            items: [
                {
                    label: "Pronoun in the Middle",
                    formula: "Verb + pronoun + particle",
                    examples: [
                        "Turn it off.",
                        "Pick it up.",
                        "Put it on.",
                        "Write it down."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Noun Object",
            question: "Which sentence is correct?",
            options: [
                "Turn off the light.",
                "Turn off it.",
                "Turn the off light.",
                "Turn light off the."
            ],
            answer: "Turn off the light.",
            explanation: "Noun object boleh diletakkan setelah particle."
        },
        {
            type: "Noun Object",
            question: "Which sentence is also correct?",
            options: [
                "Turn the light off.",
                "Turn it off the.",
                "Turn off it.",
                "Turn light the off."
            ],
            answer: "Turn the light off.",
            explanation: "Noun object juga boleh diletakkan di tengah."
        },
        {
            type: "Pronoun Object",
            question: "Replace 'the light' with 'it': Turn off the light.",
            options: [
                "Turn it off.",
                "Turn off it.",
                "Turn it the off.",
                "Turn off the it."
            ],
            answer: "Turn it off.",
            explanation: "Pronoun object wajib berada di tengah."
        },
        {
            type: "Pick Up",
            question: "Pick ___ the phone.",
            options: ["up", "after", "in", "with"],
            answer: "up",
            explanation: "Pick up berarti mengangkat atau mengambil."
        },
        {
            type: "Pick Up Pronoun",
            question: "Replace 'the phone' with 'it': Pick up the phone.",
            options: [
                "Pick it up.",
                "Pick up it.",
                "Pick it the up.",
                "Pick up the it."
            ],
            answer: "Pick it up.",
            explanation: "Pronoun harus di tengah."
        },
        {
            type: "Put On",
            question: "She put ___ her jacket.",
            options: ["on", "after", "of", "with"],
            answer: "on",
            explanation: "Put on berarti memakai pakaian."
        },
        {
            type: "Take Off",
            question: "He took ___ his shoes.",
            options: ["off", "after", "in", "with"],
            answer: "off",
            explanation: "Take off berarti melepas."
        },
        {
            type: "Write Down",
            question: "Write ___ your name.",
            options: ["down", "after", "with", "for"],
            answer: "down",
            explanation: "Write down berarti menuliskan."
        },
        {
            type: "Concept",
            question: "In separable phrasal verbs, pronoun objects must go...",
            options: [
                "between the verb and particle",
                "after the particle",
                "before the subject",
                "after the sentence"
            ],
            answer: "between the verb and particle",
            explanation: "Pronoun object wajib berada di tengah."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "Please fill it out.",
                "Please fill out it.",
                "Please fill it the out.",
                "Please fill out the it."
            ],
            answer: "Please fill it out.",
            explanation: "Fill out termasuk separable, jadi pronoun it berada di tengah."
        }
    ]
},

"inseparable-phrasal-verbs": {
    title: "Inseparable Phrasal Verbs",
    description: "Inseparable Phrasal Verbs adalah phrasal verb yang tidak dapat dipisahkan oleh object. Object selalu diletakkan setelah particle.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + Particle + Object
    `,

    notes: [
        "Inseparable phrasal verb tidak boleh dipisah.",
        "Object noun diletakkan setelah particle.",
        "Object pronoun juga tetap diletakkan setelah particle.",
        "Contoh umum: look after, look for, run into, come across, get over, deal with.",
        "Jangan letakkan object di antara verb dan particle."
    ],

    patterns: [
        {
            group: "Basic Pattern",
            items: [
                {
                    label: "Verb + Particle + Object",
                    formula: "inseparable verb + particle + object",
                    examples: [
                        "She looks after her brother.",
                        "She looks after him.",
                        "I am looking for my keys.",
                        "I am looking for them."
                    ]
                }
            ]
        },
        {
            group: "Common Inseparable Phrasal Verbs",
            items: [
                {
                    label: "Examples",
                    formula: "fixed position",
                    examples: [
                        "I ran into an old friend.",
                        "She came across an interesting article.",
                        "He finally got over the problem.",
                        "We need to deal with this issue."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Look After",
            question: "She looks ___ her little brother.",
            options: ["after", "up", "off", "down"],
            answer: "after",
            explanation: "Look after berarti menjaga atau merawat."
        },
        {
            type: "Look After",
            question: "Which sentence is correct?",
            options: [
                "She looks after him.",
                "She looks him after.",
                "She after looks him.",
                "She him looks after."
            ],
            answer: "She looks after him.",
            explanation: "Look after tidak dapat dipisah."
        },
        {
            type: "Look For",
            question: "I am looking ___ my keys.",
            options: ["for", "after", "off", "down"],
            answer: "for",
            explanation: "Look for berarti mencari."
        },
        {
            type: "Look For Pronoun",
            question: "Replace 'my keys' with 'them'.",
            options: [
                "I am looking for them.",
                "I am looking them for.",
                "I am them looking for.",
                "I am looking for the them."
            ],
            answer: "I am looking for them.",
            explanation: "Object pronoun tetap berada setelah particle."
        },
        {
            type: "Run Into",
            question: "I ran ___ an old friend yesterday.",
            options: ["into", "off", "down", "after"],
            answer: "into",
            explanation: "Run into berarti bertemu secara tidak sengaja."
        },
        {
            type: "Come Across",
            question: "She came ___ an interesting article.",
            options: ["across", "off", "down", "up"],
            answer: "across",
            explanation: "Come across berarti menemukan secara tidak sengaja."
        },
        {
            type: "Get Over",
            question: "He finally got ___ the problem.",
            options: ["over", "off", "up", "down"],
            answer: "over",
            explanation: "Get over berarti pulih atau berhasil melewati masalah."
        },
        {
            type: "Deal With",
            question: "We need to deal ___ this issue.",
            options: ["with", "off", "up", "down"],
            answer: "with",
            explanation: "Deal with berarti menangani."
        },
        {
            type: "Concept",
            question: "Inseparable phrasal verbs...",
            options: [
                "cannot be separated by an object",
                "must always be split",
                "never have objects",
                "are only used in questions"
            ],
            answer: "cannot be separated by an object",
            explanation: "Object selalu diletakkan setelah particle."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "We need to deal with it.",
                "We need to deal it with.",
                "We need with deal it.",
                "We need to it deal with."
            ],
            answer: "We need to deal with it.",
            explanation: "Deal with tidak dapat dipisah."
        }
    ]
},

"daily-phrasal-verbs": {
    title: "Common Daily Phrasal Verbs",
    description: "Common Daily Phrasal Verbs adalah phrasal verbs yang sering digunakan dalam percakapan sehari-hari, seperti wake up, get up, go out, come back, turn on, turn off, put on, take off, dan look for.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Daily Action = Common Verb + Particle
    `,

    notes: [
        "Wake up berarti bangun dari tidur.",
        "Get up berarti bangkit dari tempat tidur.",
        "Go out berarti keluar.",
        "Come back berarti kembali.",
        "Turn on berarti menyalakan.",
        "Turn off berarti mematikan.",
        "Put on berarti memakai pakaian.",
        "Take off berarti melepas pakaian.",
        "Look for berarti mencari."
    ],

    patterns: [
        {
            group: "Morning Routine",
            items: [
                {
                    label: "Wake Up / Get Up",
                    formula: "wake up / get up",
                    examples: [
                        "I wake up at 6 a.m.",
                        "She gets up early every day.",
                        "He woke up late this morning."
                    ]
                }
            ]
        },
        {
            group: "Daily Movement",
            items: [
                {
                    label: "Go Out / Come Back",
                    formula: "go out / come back",
                    examples: [
                        "We went out last night.",
                        "She came back home late.",
                        "He usually goes out on weekends."
                    ]
                }
            ]
        },
        {
            group: "Devices",
            items: [
                {
                    label: "Turn On / Turn Off",
                    formula: "turn on/off + object",
                    examples: [
                        "Please turn on the light.",
                        "Turn off the TV.",
                        "I turned my phone off."
                    ]
                }
            ]
        },
        {
            group: "Clothes",
            items: [
                {
                    label: "Put On / Take Off",
                    formula: "put on / take off + clothes",
                    examples: [
                        "Put on your jacket.",
                        "He took off his shoes.",
                        "She put her coat on."
                    ]
                }
            ]
        },
        {
            group: "Searching",
            items: [
                {
                    label: "Look For",
                    formula: "look for + object",
                    examples: [
                        "I am looking for my keys.",
                        "She is looking for her phone.",
                        "They looked for a new house."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Wake Up",
            question: "I usually ___ at 6 a.m.",
            options: ["wake up", "turn off", "look for", "take off"],
            answer: "wake up",
            explanation: "Wake up berarti bangun dari tidur."
        },
        {
            type: "Get Up",
            question: "She ___ early every morning.",
            options: ["gets up", "looks for", "turns off", "takes off"],
            answer: "gets up",
            explanation: "Get up berarti bangkit dari tempat tidur."
        },
        {
            type: "Go Out",
            question: "We ___ last night.",
            options: ["went out", "looked for", "turned on", "put on"],
            answer: "went out",
            explanation: "Go out berarti keluar."
        },
        {
            type: "Come Back",
            question: "He ___ home late.",
            options: ["came back", "turned off", "looked for", "put on"],
            answer: "came back",
            explanation: "Come back berarti kembali."
        },
        {
            type: "Turn On",
            question: "Please ___ the light.",
            options: ["turn on", "look for", "take off", "go out"],
            answer: "turn on",
            explanation: "Turn on berarti menyalakan."
        },
        {
            type: "Turn Off",
            question: "Please ___ the TV.",
            options: ["turn off", "wake up", "come back", "look for"],
            answer: "turn off",
            explanation: "Turn off berarti mematikan."
        },
        {
            type: "Put On",
            question: "It is cold. ___ your jacket.",
            options: ["Put on", "Take off", "Look for", "Go out"],
            answer: "Put on",
            explanation: "Put on berarti memakai pakaian."
        },
        {
            type: "Take Off",
            question: "Please ___ your shoes before entering.",
            options: ["take off", "put on", "turn on", "wake up"],
            answer: "take off",
            explanation: "Take off berarti melepas."
        },
        {
            type: "Look For",
            question: "I am ___ my keys.",
            options: ["looking for", "turning off", "waking up", "going out"],
            answer: "looking for",
            explanation: "Look for berarti mencari."
        },
        {
            type: "Error Check",
            question: "Which sentence is correct?",
            options: [
                "I am looking for my phone.",
                "I am looking my phone for.",
                "I am looking to my phone.",
                "I am looking after my phone. (meaning search)"
            ],
            answer: "I am looking for my phone.",
            explanation: "Look for berarti mencari dan tidak dipisah."
        }
    ]
},

"formal-phrasal-verbs": {
    title: "Academic & Formal Alternatives",
    description: "Beberapa phrasal verbs terdengar natural dalam percakapan, tetapi kurang formal dalam academic writing. Dalam tulisan formal, phrasal verbs sering diganti dengan single-word verbs yang lebih akademik.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Informal Phrasal Verb → Formal Single-Word Verb
    `,

    notes: [
        "Phrasal verbs sangat umum dalam speaking.",
        "Academic writing biasanya lebih memilih single-word verbs.",
        "Find out dapat diganti dengan discover.",
        "Look into dapat diganti dengan investigate.",
        "Put off dapat diganti dengan postpone.",
        "Set up dapat diganti dengan establish.",
        "Go up dapat diganti dengan increase.",
        "Cut down dapat diganti dengan reduce."
    ],

    patterns: [
        {
            group: "Common Formal Alternatives",
            items: [
                {
                    label: "Research / Analysis",
                    formula: "phrasal verb → formal verb",
                    examples: [
                        "find out → discover",
                        "look into → investigate",
                        "point out → indicate"
                    ]
                },
                {
                    label: "Action / Process",
                    formula: "phrasal verb → formal verb",
                    examples: [
                        "put off → postpone",
                        "set up → establish",
                        "carry out → conduct"
                    ]
                },
                {
                    label: "Change",
                    formula: "phrasal verb → formal verb",
                    examples: [
                        "go up → increase",
                        "go down → decrease",
                        "cut down → reduce"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Formal Alternative",
            question: "Find out can be replaced by...",
            options: ["discover", "wake up", "turn off", "sit down"],
            answer: "discover",
            explanation: "Discover lebih formal daripada find out."
        },
        {
            type: "Formal Alternative",
            question: "Look into can be replaced by...",
            options: ["investigate", "sleep", "arrive", "borrow"],
            answer: "investigate",
            explanation: "Investigate lebih formal daripada look into."
        },
        {
            type: "Formal Alternative",
            question: "Put off can be replaced by...",
            options: ["postpone", "increase", "reduce", "discover"],
            answer: "postpone",
            explanation: "Postpone berarti menunda."
        },
        {
            type: "Formal Alternative",
            question: "Set up can be replaced by...",
            options: ["establish", "decrease", "remove", "sleep"],
            answer: "establish",
            explanation: "Establish lebih formal daripada set up."
        },
        {
            type: "Formal Alternative",
            question: "Carry out can be replaced by...",
            options: ["conduct", "wake", "sit", "wear"],
            answer: "conduct",
            explanation: "Conduct lebih formal daripada carry out."
        },
        {
            type: "Change",
            question: "Go up can be replaced by...",
            options: ["increase", "decrease", "reduce", "postpone"],
            answer: "increase",
            explanation: "Increase berarti naik atau meningkat."
        },
        {
            type: "Change",
            question: "Go down can be replaced by...",
            options: ["decrease", "increase", "discover", "establish"],
            answer: "decrease",
            explanation: "Decrease berarti turun atau menurun."
        },
        {
            type: "Change",
            question: "Cut down can be replaced by...",
            options: ["reduce", "increase", "postpone", "discover"],
            answer: "reduce",
            explanation: "Reduce berarti mengurangi."
        },
        {
            type: "Concept",
            question: "In academic writing, phrasal verbs are often replaced by...",
            options: [
                "single-word formal verbs",
                "random nouns",
                "articles only",
                "pronouns only"
            ],
            answer: "single-word formal verbs",
            explanation: "Formal writing biasanya memakai single-word verbs."
        },
        {
            type: "Error Check",
            question: "Which sentence sounds more academic?",
            options: [
                "The researchers investigated the issue.",
                "The researchers looked into the issue.",
                "The researchers woke up the issue.",
                "The researchers turned off the issue."
            ],
            answer: "The researchers investigated the issue.",
            explanation: "Investigated lebih formal daripada looked into."
        }
    ]
},

"phrasal-verbs-review": {
    title: "Phrasal Verbs Review",
    description: "Review akhir untuk menguji seluruh materi Phrasal Verbs, termasuk separable phrasal verbs, inseparable phrasal verbs, phrasal verbs sehari-hari, serta alternatif formal dalam academic writing.",

    formula: `
        <strong>Ringkasan BAB 17:</strong><br>
        Phrasal Verb = Verb + Particle<br>
        Separable → Object dapat dipisah<br>
        Inseparable → Object tidak boleh dipisah<br>
        Daily Usage → Percakapan sehari-hari<br>
        Formal Alternative → Academic Writing
    `,

    notes: [
        "Kenali apakah phrasal verb termasuk separable atau inseparable.",
        "Pronoun pada separable phrasal verbs harus berada di tengah.",
        "Inseparable phrasal verbs tidak boleh dipisah.",
        "Banyak phrasal verbs memiliki makna idiomatik.",
        "Academic writing lebih sering menggunakan single-word verbs."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Separable",
                    formula: "Verb + Object + Particle",
                    examples: [
                        "Turn it off.",
                        "Pick it up.",
                        "Write it down."
                    ]
                },
                {
                    label: "Inseparable",
                    formula: "Verb + Particle + Object",
                    examples: [
                        "Look after the baby.",
                        "Look for your keys.",
                        "Deal with the problem."
                    ]
                },
                {
                    label: "Formal Alternative",
                    formula: "Phrasal Verb → Formal Verb",
                    examples: [
                        "find out → discover",
                        "look into → investigate",
                        "carry out → conduct"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A phrasal verb consists of...",
            options: [
                "a verb and a particle",
                "two nouns",
                "an adjective and a noun",
                "an article and a verb"
            ],
            answer: "a verb and a particle",
            explanation: "Phrasal verb dibentuk dari verb dan particle."
        },
        {
            type: "Separable",
            question: "Replace 'the light' with 'it': Turn off the light.",
            options: [
                "Turn it off.",
                "Turn off it.",
                "Turn off the it.",
                "Turn it the off."
            ],
            answer: "Turn it off.",
            explanation: "Pronoun harus berada di antara verb dan particle."
        },
        {
            type: "Separable",
            question: "Which sentence is correct?",
            options: [
                "Pick the phone up.",
                "Pick up it.",
                "Pick it the up.",
                "Pick phone up the."
            ],
            answer: "Pick the phone up.",
            explanation: "Noun object boleh berada di tengah."
        },
        {
            type: "Inseparable",
            question: "Which sentence is correct?",
            options: [
                "She looks after him.",
                "She looks him after.",
                "She after looks him.",
                "She him looks after."
            ],
            answer: "She looks after him.",
            explanation: "Look after tidak dapat dipisah."
        },
        {
            type: "Inseparable",
            question: "I am looking ___ my wallet.",
            options: [
                "for",
                "off",
                "up",
                "after"
            ],
            answer: "for",
            explanation: "Look for berarti mencari."
        },
        {
            type: "Daily",
            question: "It is cold. ___ your jacket.",
            options: [
                "Put on",
                "Take off",
                "Look for",
                "Wake up"
            ],
            answer: "Put on",
            explanation: "Put on berarti memakai pakaian."
        },
        {
            type: "Daily",
            question: "Please ___ the television before sleeping.",
            options: [
                "turn off",
                "look after",
                "wake up",
                "come across"
            ],
            answer: "turn off",
            explanation: "Turn off berarti mematikan."
        },
        {
            type: "Meaning",
            question: "What does 'run out of money' mean?",
            options: [
                "have no money left",
                "run with money",
                "find money",
                "save money"
            ],
            answer: "have no money left",
            explanation: "Run out of berarti kehabisan."
        },
        {
            type: "Formal",
            question: "Which is the most academic alternative to 'look into'?",
            options: [
                "investigate",
                "look after",
                "turn on",
                "wake up"
            ],
            answer: "investigate",
            explanation: "Investigate lebih formal daripada look into."
        },
        {
            type: "Formal",
            question: "Which is the most academic alternative to 'carry out research'?",
            options: [
                "conduct research",
                "look into research",
                "wake up research",
                "go out research"
            ],
            answer: "conduct research",
            explanation: "Conduct research adalah bentuk yang umum dalam academic writing."
        },
        {
            type: "Formal",
            question: "The prices went up rapidly. The formal replacement for 'went up' is...",
            options: [
                "increased",
                "looked into",
                "turned off",
                "came across"
            ],
            answer: "increased",
            explanation: "Increase adalah padanan formal dari go up."
        },
        {
            type: "Meaning",
            question: "What does 'come across' usually mean?",
            options: [
                "find by chance",
                "come home",
                "cross a bridge",
                "leave early"
            ],
            answer: "find by chance",
            explanation: "Come across berarti menemukan secara tidak sengaja."
        },
        {
            type: "Meaning",
            question: "What does 'get over' usually mean?",
            options: [
                "recover from",
                "jump over",
                "climb onto",
                "look after"
            ],
            answer: "recover from",
            explanation: "Get over berarti pulih atau berhasil melewati sesuatu."
        },
        {
            type: "Concept",
            question: "In a separable phrasal verb, a pronoun object must be...",
            options: [
                "between the verb and the particle",
                "after the particle",
                "before the subject",
                "at the end of the paragraph"
            ],
            answer: "between the verb and the particle",
            explanation: "Pronoun wajib berada di tengah."
        },
        {
            type: "Concept",
            question: "Which phrasal verb is inseparable?",
            options: [
                "look after",
                "turn off",
                "pick up",
                "write down"
            ],
            answer: "look after",
            explanation: "Look after tidak dapat dipisahkan oleh object."
        },
        {
            type: "Error Check",
            question: "Which sentence is grammatically correct?",
            options: [
                "Please write it down.",
                "Please write down it.",
                "Please write it the down.",
                "Please down write it."
            ],
            answer: "Please write it down.",
            explanation: "Write down adalah separable phrasal verb, sehingga pronoun berada di tengah."
        },
        {
            type: "Error Check",
            question: "Which sentence is grammatically correct?",
            options: [
                "She is looking for her passport.",
                "She is looking her passport for.",
                "She is looking for it passport.",
                "She is looking passport for."
            ],
            answer: "She is looking for her passport.",
            explanation: "Look for adalah inseparable phrasal verb."
        },
        {
            type: "Error Check",
            question: "Which sentence is the most appropriate for an academic report?",
            options: [
                "The researchers conducted the experiment.",
                "The researchers carried out the experiment.",
                "The researchers looked into the experiment.",
                "The researchers set up the experiment."
            ],
            answer: "The researchers conducted the experiment.",
            explanation: "Conduct merupakan pilihan yang paling formal untuk academic writing."
        },
        {
            type: "Application",
            question: "Which sentence sounds the most natural in everyday conversation?",
            options: [
                "Can you turn the TV off?",
                "Can you deactivate the television?",
                "Can you discontinue the television?",
                "Can you terminate the television?"
            ],
            answer: "Can you turn the TV off?",
            explanation: "Dalam percakapan sehari-hari, phrasal verb lebih natural dibanding padanan formalnya."
        },
        {
            type: "Final",
            question: "Which sentence is completely correct?",
            options: [
                "She picked it up and looked after her little brother.",
                "She picked up it and looked her little brother after.",
                "She picked it up and looked her little brother after.",
                "She picked up it and looked after him the."
            ],
            answer: "She picked it up and looked after her little brother.",
            explanation: "Picked up adalah separable (pronoun di tengah), sedangkan look after adalah inseparable."
        }
    ]
},

"idioms": {
    title: "Introduction to Idioms",
    description: "Idiom adalah ekspresi yang maknanya tidak selalu bisa ditebak dari arti kata per kata. Idiom sering digunakan dalam percakapan sehari-hari, media, bisnis, dan tulisan informal maupun semi-formal.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Idiom = Expression with special meaning
    `,

    notes: [
        "Idiom memiliki makna khusus.",
        "Arti idiom sering berbeda dari arti literal kata-katanya.",
        "Idiom membuat bahasa terdengar lebih natural.",
        "Idiom banyak digunakan oleh native speakers.",
        "Tidak semua idiom cocok untuk academic writing formal.",
        "Memahami idiom membantu listening, reading, dan conversation."
    ],

    patterns: [
        {
            group: "Literal vs Idiomatic Meaning",
            items: [
                {
                    label: "Literal Meaning",
                    formula: "word-by-word meaning",
                    examples: [
                        "Break the ice = memecahkan es secara literal.",
                        "Hit the books = memukul buku secara literal.",
                        "A piece of cake = sepotong kue secara literal."
                    ]
                },
                {
                    label: "Idiomatic Meaning",
                    formula: "special expression meaning",
                    examples: [
                        "Break the ice = start a friendly conversation.",
                        "Hit the books = study hard.",
                        "A piece of cake = very easy."
                    ]
                }
            ]
        },
        {
            group: "Common Idioms",
            items: [
                {
                    label: "Daily Usage",
                    formula: "idiom + meaning",
                    examples: [
                        "A piece of cake = very easy.",
                        "Break the ice = start a conversation.",
                        "Under the weather = feeling sick."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "An idiom is...",
            options: [
                "an expression with a special meaning",
                "a normal plural noun",
                "an article",
                "a punctuation mark"
            ],
            answer: "an expression with a special meaning",
            explanation: "Idiom adalah ekspresi dengan makna khusus."
        },
        {
            type: "Meaning",
            question: "What does 'a piece of cake' mean?",
            options: [
                "very easy",
                "very expensive",
                "very dangerous",
                "very cold"
            ],
            answer: "very easy",
            explanation: "A piece of cake berarti sesuatu yang sangat mudah."
        },
        {
            type: "Meaning",
            question: "What does 'break the ice' mean?",
            options: [
                "start a friendly conversation",
                "destroy frozen water",
                "stop talking",
                "make someone angry"
            ],
            answer: "start a friendly conversation",
            explanation: "Break the ice berarti memulai percakapan agar suasana lebih nyaman."
        },
        {
            type: "Meaning",
            question: "What does 'hit the books' mean?",
            options: [
                "study hard",
                "throw books",
                "buy books",
                "clean books"
            ],
            answer: "study hard",
            explanation: "Hit the books berarti belajar dengan serius."
        },
        {
            type: "Meaning",
            question: "What does 'under the weather' mean?",
            options: [
                "feeling sick",
                "standing outside",
                "watching the sky",
                "enjoying the rain"
            ],
            answer: "feeling sick",
            explanation: "Under the weather berarti sedang tidak enak badan."
        },
        {
            type: "Concept",
            question: "Idioms often cannot be understood by...",
            options: [
                "word-by-word translation",
                "context",
                "practice",
                "examples"
            ],
            answer: "word-by-word translation",
            explanation: "Makna idiom sering berbeda dari arti literal kata-katanya."
        },
        {
            type: "Usage",
            question: "Which sentence uses an idiom correctly?",
            options: [
                "The exam was a piece of cake.",
                "The exam was a piece of table.",
                "The exam was under the chair.",
                "The exam hit the weather."
            ],
            answer: "The exam was a piece of cake.",
            explanation: "A piece of cake berarti mudah."
        },
        {
            type: "Usage",
            question: "Which sentence uses an idiom correctly?",
            options: [
                "I need to hit the books tonight.",
                "I need to hit the water tonight.",
                "I need to break the weather tonight.",
                "I need to cake the books tonight."
            ],
            answer: "I need to hit the books tonight.",
            explanation: "Hit the books berarti belajar keras."
        },
        {
            type: "Concept",
            question: "Idioms make English sound more...",
            options: [
                "natural",
                "mathematical",
                "silent",
                "plural"
            ],
            answer: "natural",
            explanation: "Idiom membantu bahasa terdengar lebih natural."
        },
        {
            type: "Formal Writing",
            question: "In very formal academic writing, idioms should usually be used...",
            options: [
                "carefully",
                "in every sentence",
                "instead of all verbs",
                "without context"
            ],
            answer: "carefully",
            explanation: "Tidak semua idiom cocok untuk tulisan akademik formal."
        }
    ]
},

"daily-idioms": {
    title: "Common Daily Idioms",
    description: "Common Daily Idioms adalah idiom yang sering digunakan dalam percakapan sehari-hari. Idiom ini membantu pengguna memahami ekspresi natural dalam speaking, listening, film, lagu, dan percakapan informal.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Daily Idiom = Natural Expression for Daily Conversation
    `,

    notes: [
        "A piece of cake berarti sangat mudah.",
        "Break the ice berarti mencairkan suasana.",
        "Hit the books berarti belajar serius.",
        "Under the weather berarti sedang tidak enak badan.",
        "Hang out berarti menghabiskan waktu santai bersama orang lain.",
        "Call it a day berarti berhenti bekerja untuk hari itu.",
        "Take it easy berarti santai saja.",
        "Once in a blue moon berarti sangat jarang."
    ],

    patterns: [
        {
            group: "Easy / Difficult",
            items: [
                {
                    label: "A Piece of Cake",
                    formula: "a piece of cake = very easy",
                    examples: [
                        "The quiz was a piece of cake.",
                        "Fixing this problem is a piece of cake.",
                        "The task looked hard, but it was a piece of cake."
                    ]
                }
            ]
        },
        {
            group: "Social Situation",
            items: [
                {
                    label: "Break the Ice / Hang Out",
                    formula: "social idioms",
                    examples: [
                        "The teacher told a joke to break the ice.",
                        "We usually hang out after school.",
                        "Small talk can help break the ice."
                    ]
                }
            ]
        },
        {
            group: "Study / Work",
            items: [
                {
                    label: "Hit the Books / Call It a Day",
                    formula: "study and work idioms",
                    examples: [
                        "I need to hit the books tonight.",
                        "Let's call it a day and continue tomorrow.",
                        "She hit the books before the final exam."
                    ]
                }
            ]
        },
        {
            group: "Condition / Frequency",
            items: [
                {
                    label: "Under the Weather / Once in a Blue Moon",
                    formula: "condition and frequency idioms",
                    examples: [
                        "I feel under the weather today.",
                        "He visits us once in a blue moon.",
                        "She only eats fast food once in a blue moon."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Meaning",
            question: "What does 'a piece of cake' mean?",
            options: ["very easy", "very difficult", "very expensive", "very cold"],
            answer: "very easy",
            explanation: "A piece of cake berarti sangat mudah."
        },
        {
            type: "Meaning",
            question: "What does 'break the ice' mean?",
            options: [
                "make people feel more comfortable",
                "freeze water",
                "stop a meeting",
                "make someone angry"
            ],
            answer: "make people feel more comfortable",
            explanation: "Break the ice berarti mencairkan suasana."
        },
        {
            type: "Meaning",
            question: "What does 'hit the books' mean?",
            options: ["study seriously", "throw books", "buy books", "clean books"],
            answer: "study seriously",
            explanation: "Hit the books berarti belajar serius."
        },
        {
            type: "Meaning",
            question: "What does 'under the weather' mean?",
            options: ["feeling sick", "feeling excited", "standing outside", "watching rain"],
            answer: "feeling sick",
            explanation: "Under the weather berarti sedang tidak enak badan."
        },
        {
            type: "Meaning",
            question: "What does 'hang out' mean?",
            options: [
                "spend time socially",
                "hang clothes outside",
                "leave quickly",
                "sleep early"
            ],
            answer: "spend time socially",
            explanation: "Hang out berarti menghabiskan waktu santai bersama orang lain."
        },
        {
            type: "Meaning",
            question: "What does 'call it a day' mean?",
            options: [
                "stop working for the day",
                "name a day",
                "call someone today",
                "start a new job"
            ],
            answer: "stop working for the day",
            explanation: "Call it a day berarti berhenti bekerja untuk hari itu."
        },
        {
            type: "Meaning",
            question: "What does 'take it easy' mean?",
            options: ["relax", "work harder", "run faster", "study all night"],
            answer: "relax",
            explanation: "Take it easy berarti santai saja."
        },
        {
            type: "Meaning",
            question: "What does 'once in a blue moon' mean?",
            options: ["very rarely", "every day", "very quickly", "very loudly"],
            answer: "very rarely",
            explanation: "Once in a blue moon berarti sangat jarang."
        },
        {
            type: "Usage",
            question: "Which sentence uses the idiom correctly?",
            options: [
                "I feel under the weather, so I will rest.",
                "I feel a piece of cake, so I will rest.",
                "I feel hit the books, so I will rest.",
                "I feel call it a day, so I will rest."
            ],
            answer: "I feel under the weather, so I will rest.",
            explanation: "Under the weather digunakan untuk kondisi sakit atau kurang sehat."
        },
        {
            type: "Usage",
            question: "Which sentence uses the idiom correctly?",
            options: [
                "Let's call it a day and continue tomorrow.",
                "Let's hit the weather and continue tomorrow.",
                "Let's piece the cake and continue tomorrow.",
                "Let's blue moon and continue tomorrow."
            ],
            answer: "Let's call it a day and continue tomorrow.",
            explanation: "Call it a day berarti berhenti bekerja untuk hari itu."
        }
    ]
},

"academic-idioms": {
    title: "Business & Academic Idioms",
    description: "Business & Academic Idioms adalah idiom yang sering digunakan dalam konteks kerja, rapat, presentasi, diskusi profesional, dan tulisan semi-formal. Idiom ini harus digunakan dengan hati-hati agar tetap sesuai konteks.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Professional Idiom = Expression used in work or academic context
    `,

    notes: [
        "Get the ball rolling berarti memulai sesuatu.",
        "On the same page berarti memiliki pemahaman yang sama.",
        "Think outside the box berarti berpikir kreatif.",
        "Back to square one berarti kembali ke titik awal.",
        "Raise the bar berarti meningkatkan standar.",
        "A learning curve berarti proses belajar yang membutuhkan waktu.",
        "In a nutshell berarti secara singkat.",
        "At the end of the day berarti pada akhirnya."
    ],

    patterns: [
        {
            group: "Meeting & Teamwork",
            items: [
                {
                    label: "Get the Ball Rolling",
                    formula: "get the ball rolling = start something",
                    examples: [
                        "Let's get the ball rolling with the first agenda.",
                        "We need a clear plan to get the ball rolling.",
                        "The manager started the meeting to get the ball rolling."
                    ]
                },
                {
                    label: "On the Same Page",
                    formula: "on the same page = have the same understanding",
                    examples: [
                        "Before we continue, let's make sure we are on the same page.",
                        "The team is finally on the same page.",
                        "We need a short briefing so everyone is on the same page."
                    ]
                }
            ]
        },
        {
            group: "Problem Solving",
            items: [
                {
                    label: "Think Outside the Box",
                    formula: "think outside the box = think creatively",
                    examples: [
                        "We need to think outside the box to solve this issue.",
                        "The project requires people who can think outside the box.",
                        "She found a solution by thinking outside the box."
                    ]
                },
                {
                    label: "Back to Square One",
                    formula: "back to square one = return to the beginning",
                    examples: [
                        "The plan failed, so we are back to square one.",
                        "If the test does not work, we will be back to square one.",
                        "After the mistake, the team went back to square one."
                    ]
                }
            ]
        },
        {
            group: "Performance & Summary",
            items: [
                {
                    label: "Raise the Bar / In a Nutshell",
                    formula: "performance and summary idioms",
                    examples: [
                        "This new standard will raise the bar for all teams.",
                        "In a nutshell, the proposal is practical and affordable.",
                        "At the end of the day, quality matters most."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Meaning",
            question: "What does 'get the ball rolling' mean?",
            options: ["start something", "stop a project", "make a mistake", "delay a meeting"],
            answer: "start something",
            explanation: "Get the ball rolling berarti memulai sesuatu."
        },
        {
            type: "Meaning",
            question: "What does 'on the same page' mean?",
            options: [
                "having the same understanding",
                "reading the same book",
                "writing on paper",
                "standing in line"
            ],
            answer: "having the same understanding",
            explanation: "On the same page berarti memiliki pemahaman yang sama."
        },
        {
            type: "Meaning",
            question: "What does 'think outside the box' mean?",
            options: [
                "think creatively",
                "open a box",
                "avoid thinking",
                "copy an old idea"
            ],
            answer: "think creatively",
            explanation: "Think outside the box berarti berpikir kreatif."
        },
        {
            type: "Meaning",
            question: "What does 'back to square one' mean?",
            options: [
                "return to the beginning",
                "finish successfully",
                "move forward quickly",
                "increase profit"
            ],
            answer: "return to the beginning",
            explanation: "Back to square one berarti kembali ke titik awal."
        },
        {
            type: "Meaning",
            question: "What does 'raise the bar' mean?",
            options: [
                "increase the standard",
                "lower the quality",
                "open a restaurant",
                "remove a rule"
            ],
            answer: "increase the standard",
            explanation: "Raise the bar berarti meningkatkan standar."
        },
        {
            type: "Meaning",
            question: "What does 'in a nutshell' mean?",
            options: [
                "briefly",
                "angrily",
                "secretly",
                "slowly"
            ],
            answer: "briefly",
            explanation: "In a nutshell berarti secara singkat."
        },
        {
            type: "Meaning",
            question: "What does 'at the end of the day' mean?",
            options: [
                "ultimately",
                "at night only",
                "after sleeping",
                "before breakfast"
            ],
            answer: "ultimately",
            explanation: "At the end of the day berarti pada akhirnya."
        },
        {
            type: "Usage",
            question: "Which sentence uses the idiom correctly?",
            options: [
                "Before the meeting continues, let's make sure we are on the same page.",
                "Before the meeting continues, let's eat the same page.",
                "Before the meeting continues, let's write the same page.",
                "Before the meeting continues, let's sleep on the same page."
            ],
            answer: "Before the meeting continues, let's make sure we are on the same page.",
            explanation: "On the same page cocok untuk memastikan pemahaman yang sama."
        },
        {
            type: "Usage",
            question: "Which sentence uses the idiom correctly?",
            options: [
                "We need to think outside the box to solve this problem.",
                "We need to sleep outside the box to solve this problem.",
                "We need to eat outside the box to solve this problem.",
                "We need to write outside the box to solve this problem."
            ],
            answer: "We need to think outside the box to solve this problem.",
            explanation: "Think outside the box digunakan untuk problem solving kreatif."
        },
        {
            type: "Formal Use",
            question: "In academic writing, idioms should be used...",
            options: [
                "carefully and only when appropriate",
                "in every sentence",
                "instead of all evidence",
                "without context"
            ],
            answer: "carefully and only when appropriate",
            explanation: "Idioms tidak selalu cocok untuk tulisan akademik formal."
        }
    ]
},

"body-idioms": {
    title: "Body Idioms",
    description: "Body Idioms adalah idiom yang menggunakan bagian tubuh manusia seperti eye, hand, head, heart, face, dan shoulder. Arti idiom ini biasanya tidak sama dengan arti literalnya dan sering digunakan dalam percakapan sehari-hari maupun bisnis.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Body Part + Figurative Meaning
    `,

    notes: [
        "Body idioms sangat umum digunakan oleh native speakers.",
        "Makna idiom biasanya tidak berhubungan langsung dengan bagian tubuh tersebut.",
        "Body idioms sering muncul dalam film, berita, podcast, dan percakapan sehari-hari.",
        "Pahami makna keseluruhan, bukan arti kata per kata.",
        "Beberapa body idioms juga digunakan dalam konteks bisnis."
    ],

    patterns: [
        {
            group: "Eye Idioms",
            items: [
                {
                    label: "Keep an Eye On / Catch Someone's Eye",
                    formula: "eye idioms",
                    examples: [
                        "Please keep an eye on my bag.",
                        "That colorful painting caught my eye.",
                        "Can you keep an eye on the children?"
                    ]
                }
            ]
        },
        {
            group: "Hand Idioms",
            items: [
                {
                    label: "Give a Hand / On the Other Hand",
                    formula: "hand idioms",
                    examples: [
                        "Could you give me a hand?",
                        "On the other hand, the second option is cheaper.",
                        "She gave me a hand with the project."
                    ]
                }
            ]
        },
        {
            group: "Head Idioms",
            items: [
                {
                    label: "Keep Your Head / Lose Your Head",
                    formula: "head idioms",
                    examples: [
                        "Keep your head during the interview.",
                        "He lost his head during the argument.",
                        "She always keeps her head in difficult situations."
                    ]
                }
            ]
        },
        {
            group: "Heart Idioms",
            items: [
                {
                    label: "Learn by Heart / Change of Heart",
                    formula: "heart idioms",
                    examples: [
                        "Students should learn the poem by heart.",
                        "He had a change of heart.",
                        "She knows the speech by heart."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Eye",
            question: "What does 'keep an eye on' mean?",
            options: [
                "watch carefully",
                "close your eyes",
                "wear glasses",
                "look away"
            ],
            answer: "watch carefully",
            explanation: "Keep an eye on berarti mengawasi atau memperhatikan."
        },
        {
            type: "Eye",
            question: "What does 'catch someone's eye' mean?",
            options: [
                "attract someone's attention",
                "hurt someone's eye",
                "look at someone angrily",
                "wear sunglasses"
            ],
            answer: "attract someone's attention",
            explanation: "Catch someone's eye berarti menarik perhatian."
        },
        {
            type: "Hand",
            question: "What does 'give someone a hand' mean?",
            options: [
                "help someone",
                "shake hands",
                "wave goodbye",
                "hold hands"
            ],
            answer: "help someone",
            explanation: "Give someone a hand berarti membantu seseorang."
        },
        {
            type: "Hand",
            question: "What does 'on the other hand' mean?",
            options: [
                "considering another point of view",
                "using your left hand",
                "changing hands",
                "giving assistance"
            ],
            answer: "considering another point of view",
            explanation: "On the other hand digunakan untuk memperkenalkan sudut pandang lain."
        },
        {
            type: "Head",
            question: "What does 'keep your head' mean?",
            options: [
                "stay calm",
                "wear a hat",
                "move your head",
                "look upward"
            ],
            answer: "stay calm",
            explanation: "Keep your head berarti tetap tenang."
        },
        {
            type: "Head",
            question: "What does 'lose your head' mean?",
            options: [
                "panic or lose self-control",
                "forget your name",
                "sleep deeply",
                "become taller"
            ],
            answer: "panic or lose self-control",
            explanation: "Lose your head berarti panik atau kehilangan kendali."
        },
        {
            type: "Heart",
            question: "What does 'learn by heart' mean?",
            options: [
                "memorize completely",
                "study medicine",
                "read quickly",
                "learn emotionally"
            ],
            answer: "memorize completely",
            explanation: "Learn by heart berarti menghafal."
        },
        {
            type: "Heart",
            question: "What does 'change of heart' mean?",
            options: [
                "change your opinion or decision",
                "heart surgery",
                "exercise more",
                "become healthier"
            ],
            answer: "change your opinion or decision",
            explanation: "Change of heart berarti berubah pikiran."
        },
        {
            type: "Usage",
            question: "Which sentence uses an idiom correctly?",
            options: [
                "Can you give me a hand with this report?",
                "Can you give me your hand forever?",
                "Can you lose your head with this report?",
                "Can you catch my eye on this report?"
            ],
            answer: "Can you give me a hand with this report?",
            explanation: "Give me a hand berarti membantu."
        },
        {
            type: "Usage",
            question: "Which sentence uses an idiom correctly?",
            options: [
                "Please keep an eye on my luggage while I'm away.",
                "Please keep your eye inside your bag.",
                "Please catch my eye in the suitcase.",
                "Please lose your head near my luggage."
            ],
            answer: "Please keep an eye on my luggage while I'm away.",
            explanation: "Keep an eye on berarti mengawasi sesuatu."
        }
    ]
},

"animal-idioms": {
    title: "Animal Idioms",
    description: "Animal Idioms adalah idiom yang menggunakan nama hewan untuk menggambarkan sifat, situasi, atau perilaku seseorang. Idiom ini sangat umum digunakan dalam percakapan sehari-hari, media, dan bahasa Inggris informal.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Animal + Figurative Meaning
    `,

    notes: [
        "Animal idioms tidak memiliki arti literal.",
        "Makna idiom harus dipahami sebagai satu kesatuan.",
        "Banyak animal idioms menggambarkan karakter seseorang.",
        "Animal idioms sering muncul dalam film, novel, podcast, dan percakapan.",
        "Tidak semua animal idioms cocok digunakan dalam situasi formal."
    ],

    patterns: [
        {
            group: "Ability & Personality",
            items: [
                {
                    label: "Busy Bee / Copycat / Dark Horse",
                    formula: "personality idioms",
                    examples: [
                        "Sarah is a busy bee who always finishes her work early.",
                        "Don't be a copycat. Create your own ideas.",
                        "Nobody expected him to win. He was a dark horse."
                    ]
                }
            ]
        },
        {
            group: "Situation",
            items: [
                {
                    label: "The Elephant in the Room / Let the Cat Out of the Bag",
                    formula: "situation idioms",
                    examples: [
                        "Nobody wanted to discuss the elephant in the room.",
                        "She accidentally let the cat out of the bag.",
                        "Let's address the elephant in the room before continuing."
                    ]
                }
            ]
        },
        {
            group: "Behavior",
            items: [
                {
                    label: "Kill Two Birds with One Stone / Hold Your Horses",
                    formula: "action idioms",
                    examples: [
                        "Cycling to work kills two birds with one stone.",
                        "Hold your horses! We haven't finished yet.",
                        "Studying while commuting can kill two birds with one stone."
                    ]
                }
            ]
        },
        {
            group: "Risk",
            items: [
                {
                    label: "A Black Sheep / Cry Wolf",
                    formula: "behavior idioms",
                    examples: [
                        "He is considered the black sheep of the family.",
                        "Don't cry wolf unless there is a real emergency.",
                        "People stopped believing him because he cried wolf too often."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Meaning",
            question: "What does 'busy bee' mean?",
            options: [
                "a hardworking person",
                "a noisy person",
                "a lazy person",
                "an angry person"
            ],
            answer: "a hardworking person",
            explanation: "Busy bee berarti orang yang rajin dan sibuk."
        },
        {
            type: "Meaning",
            question: "What does 'copycat' mean?",
            options: [
                "someone who imitates others",
                "someone who likes cats",
                "someone who draws well",
                "someone who travels often"
            ],
            answer: "someone who imitates others",
            explanation: "Copycat berarti orang yang meniru orang lain."
        },
        {
            type: "Meaning",
            question: "What does 'dark horse' mean?",
            options: [
                "an unexpected winner",
                "a black horse",
                "a slow runner",
                "a dishonest person"
            ],
            answer: "an unexpected winner",
            explanation: "Dark horse berarti seseorang yang berhasil secara tak terduga."
        },
        {
            type: "Meaning",
            question: "What does 'the elephant in the room' mean?",
            options: [
                "an obvious problem that everyone avoids discussing",
                "a large animal",
                "a crowded meeting",
                "a difficult journey"
            ],
            answer: "an obvious problem that everyone avoids discussing",
            explanation: "Elephant in the room berarti masalah besar yang dihindari pembahasannya."
        },
        {
            type: "Meaning",
            question: "What does 'let the cat out of the bag' mean?",
            options: [
                "reveal a secret",
                "buy a pet",
                "lose something",
                "catch an animal"
            ],
            answer: "reveal a secret",
            explanation: "Let the cat out of the bag berarti membocorkan rahasia."
        },
        {
            type: "Meaning",
            question: "What does 'kill two birds with one stone' mean?",
            options: [
                "achieve two goals with one action",
                "hunt birds",
                "work very slowly",
                "make two mistakes"
            ],
            answer: "achieve two goals with one action",
            explanation: "Kill two birds with one stone berarti mencapai dua tujuan sekaligus."
        },
        {
            type: "Meaning",
            question: "What does 'hold your horses' mean?",
            options: [
                "wait or be patient",
                "ride a horse",
                "run faster",
                "keep animals safely"
            ],
            answer: "wait or be patient",
            explanation: "Hold your horses berarti tunggu atau sabar."
        },
        {
            type: "Meaning",
            question: "What does 'black sheep' mean?",
            options: [
                "a person who is different from the rest of the group",
                "a black animal",
                "a successful student",
                "a careful driver"
            ],
            answer: "a person who is different from the rest of the group",
            explanation: "Black sheep berarti seseorang yang dianggap berbeda atau tidak sesuai dengan kelompoknya."
        },
        {
            type: "Meaning",
            question: "What does 'cry wolf' mean?",
            options: [
                "give false warnings",
                "shout loudly",
                "see a wolf",
                "protect animals"
            ],
            answer: "give false warnings",
            explanation: "Cry wolf berarti memberikan peringatan palsu hingga orang lain tidak lagi percaya."
        },
        {
            type: "Usage",
            question: "Which sentence uses an animal idiom correctly?",
            options: [
                "Please hold your horses; we need a few more minutes.",
                "Please ride your horses; we need a few more minutes.",
                "Please feed your horses; we need a few more minutes.",
                "Please buy your horses; we need a few more minutes."
            ],
            answer: "Please hold your horses; we need a few more minutes.",
            explanation: "Hold your horses berarti bersabar atau menunggu."
        }
    ]
},

"idioms-review": {
    title: "Idioms Review",
    description: "Review akhir untuk menguji seluruh materi Idioms, termasuk idiom sehari-hari, idiom bisnis, body idioms, animal idioms, serta penggunaan idiom dalam konteks yang tepat.",

    formula: `
        <strong>Ringkasan BAB 18:</strong><br>
        Idiom = Expression with figurative meaning<br>
        Daily Idioms<br>
        Business Idioms<br>
        Body Idioms<br>
        Animal Idioms
    `,

    notes: [
        "Idiom tidak dapat diterjemahkan kata per kata.",
        "Pahami makna keseluruhan idiom.",
        "Perhatikan konteks penggunaan.",
        "Tidak semua idiom cocok untuk academic writing formal.",
        "Semakin banyak idiom yang dipahami, semakin natural kemampuan listening dan speaking."
    ],

    patterns: [
        {
            group: "Daily Idioms",
            items: [
                {
                    label: "Common Expressions",
                    formula: "daily conversation",
                    examples: [
                        "A piece of cake = very easy.",
                        "Break the ice = start a conversation.",
                        "Call it a day = stop working."
                    ]
                }
            ]
        },
        {
            group: "Business Idioms",
            items: [
                {
                    label: "Professional Context",
                    formula: "meeting and teamwork",
                    examples: [
                        "Get the ball rolling.",
                        "On the same page.",
                        "Think outside the box."
                    ]
                }
            ]
        },
        {
            group: "Body & Animal Idioms",
            items: [
                {
                    label: "Common Figurative Expressions",
                    formula: "body and animal idioms",
                    examples: [
                        "Keep an eye on.",
                        "Give me a hand.",
                        "Busy bee.",
                        "Hold your horses."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "An idiom is...",
            options: [
                "an expression with a figurative meaning",
                "a plural noun",
                "a verb tense",
                "a punctuation mark"
            ],
            answer: "an expression with a figurative meaning",
            explanation: "Idiom memiliki makna khusus yang berbeda dari arti literalnya."
        },
        {
            type: "Daily",
            question: "The exam was ___.",
            options: [
                "a piece of cake",
                "a black sheep",
                "under the table",
                "a busy bee"
            ],
            answer: "a piece of cake",
            explanation: "A piece of cake berarti sangat mudah."
        },
        {
            type: "Daily",
            question: "The teacher told a joke to ___.",
            options: [
                "break the ice",
                "cry wolf",
                "lose his head",
                "call it a day"
            ],
            answer: "break the ice",
            explanation: "Break the ice berarti mencairkan suasana."
        },
        {
            type: "Daily",
            question: "I need to ___ tonight because the exam is tomorrow.",
            options: [
                "hit the books",
                "hold my horses",
                "let the cat out of the bag",
                "raise the bar"
            ],
            answer: "hit the books",
            explanation: "Hit the books berarti belajar serius."
        },
        {
            type: "Daily",
            question: "I feel ___. I think I'll stay home today.",
            options: [
                "under the weather",
                "a dark horse",
                "a busy bee",
                "on the same page"
            ],
            answer: "under the weather",
            explanation: "Under the weather berarti sedang tidak enak badan."
        },
        {
            type: "Business",
            question: "Let's ___ by discussing the first agenda.",
            options: [
                "get the ball rolling",
                "cry wolf",
                "keep our head",
                "take it easy"
            ],
            answer: "get the ball rolling",
            explanation: "Get the ball rolling berarti memulai sesuatu."
        },
        {
            type: "Business",
            question: "Before starting the project, everyone should be ___.",
            options: [
                "on the same page",
                "under the weather",
                "once in a blue moon",
                "a copycat"
            ],
            answer: "on the same page",
            explanation: "On the same page berarti memiliki pemahaman yang sama."
        },
        {
            type: "Business",
            question: "We need to ___ to solve this difficult problem.",
            options: [
                "think outside the box",
                "hit the books",
                "catch someone's eye",
                "call it a day"
            ],
            answer: "think outside the box",
            explanation: "Think outside the box berarti berpikir kreatif."
        },
        {
            type: "Body Idiom",
            question: "Could you ___ with these boxes?",
            options: [
                "give me a hand",
                "keep your head",
                "lose your head",
                "learn by heart"
            ],
            answer: "give me a hand",
            explanation: "Give me a hand berarti membantu."
        },
        {
            type: "Body Idiom",
            question: "Please ___ my backpack while I buy a drink.",
            options: [
                "keep an eye on",
                "lose your head",
                "learn by heart",
                "change of heart"
            ],
            answer: "keep an eye on",
            explanation: "Keep an eye on berarti mengawasi."
        },
        {
            type: "Animal Idiom",
            question: "Don't ___. There isn't really any danger.",
            options: [
                "cry wolf",
                "break the ice",
                "call it a day",
                "take it easy"
            ],
            answer: "cry wolf",
            explanation: "Cry wolf berarti memberikan peringatan palsu."
        },
        {
            type: "Animal Idiom",
            question: "Please ___. We still need five more minutes.",
            options: [
                "hold your horses",
                "raise the bar",
                "get the ball rolling",
                "hang out"
            ],
            answer: "hold your horses",
            explanation: "Hold your horses berarti bersabar."
        },
        {
            type: "Animal Idiom",
            question: "Nobody expected the new player to win. He was a ___.",
            options: [
                "dark horse",
                "busy bee",
                "copycat",
                "black sheep"
            ],
            answer: "dark horse",
            explanation: "Dark horse berarti pemenang yang tidak diduga."
        },
        {
            type: "Animal Idiom",
            question: "She accidentally ___ about the surprise party.",
            options: [
                "let the cat out of the bag",
                "kept an eye on",
                "called it a day",
                "took it easy"
            ],
            answer: "let the cat out of the bag",
            explanation: "Let the cat out of the bag berarti membocorkan rahasia."
        },
        {
            type: "Meaning",
            question: "Which idiom means 'very rarely'?",
            options: [
                "once in a blue moon",
                "busy bee",
                "a piece of cake",
                "break the ice"
            ],
            answer: "once in a blue moon",
            explanation: "Once in a blue moon berarti sangat jarang."
        },
        {
            type: "Meaning",
            question: "Which idiom means 'stop working for today'?",
            options: [
                "call it a day",
                "raise the bar",
                "get over it",
                "look after"
            ],
            answer: "call it a day",
            explanation: "Call it a day berarti berhenti bekerja untuk hari itu."
        },
        {
            type: "Meaning",
            question: "Which idiom means 'memorize completely'?",
            options: [
                "learn by heart",
                "lose your head",
                "keep your head",
                "catch someone's eye"
            ],
            answer: "learn by heart",
            explanation: "Learn by heart berarti menghafal sepenuhnya."
        },
        {
            type: "Usage",
            question: "Which sentence uses an idiom correctly?",
            options: [
                "Let's call it a day and continue tomorrow.",
                "Let's break the weather tomorrow.",
                "Let's cry the books tomorrow.",
                "Let's piece the cake tomorrow."
            ],
            answer: "Let's call it a day and continue tomorrow.",
            explanation: "Call it a day digunakan untuk mengakhiri pekerjaan hari itu."
        },
        {
            type: "Usage",
            question: "Which sentence sounds the most natural?",
            options: [
                "We need to think outside the box.",
                "We need to think outside the room.",
                "We need to think outside the school.",
                "We need to think outside the chair."
            ],
            answer: "We need to think outside the box.",
            explanation: "Think outside the box adalah idiom yang berarti berpikir kreatif."
        },
        {
            type: "Final",
            question: "Which sentence is completely correct?",
            options: [
                "Let's get the ball rolling. At the end of the day, we all want the project to succeed.",
                "Let's get the football rolling. At the end of the weather, we all succeed.",
                "Let's break the ball rolling. At the end of the page, we succeed.",
                "Let's hold the books rolling. At the end of the box, we succeed."
            ],
            answer: "Let's get the ball rolling. At the end of the day, we all want the project to succeed.",
            explanation: "Kalimat menggunakan dua idiom dengan makna dan konteks yang tepat."
        }
    ]
},

"collocations": {
    title: "Introduction to Collocations",
    description: "Collocation adalah kombinasi kata yang terdengar natural karena sering digunakan bersama oleh penutur Bahasa Inggris. Collocation membantu kalimat terdengar lebih tepat, lancar, dan native-like.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Natural Word Combination = Collocation
    `,

    notes: [
        "Collocation adalah pasangan atau kombinasi kata yang lazim digunakan bersama.",
        "Collocation tidak selalu bisa diterjemahkan langsung dari Bahasa Indonesia.",
        "Strong coffee lebih natural daripada powerful coffee.",
        "Make a decision lebih natural daripada do a decision.",
        "Heavy rain lebih natural daripada strong rain.",
        "Collocation penting untuk speaking, writing, IELTS, TOEFL, dan academic English."
    ],

    patterns: [
        {
            group: "Common Types",
            items: [
                {
                    label: "Verb + Noun",
                    formula: "verb + noun",
                    examples: [
                        "make a decision",
                        "take a break",
                        "do homework"
                    ]
                },
                {
                    label: "Adjective + Noun",
                    formula: "adjective + noun",
                    examples: [
                        "strong coffee",
                        "heavy rain",
                        "deep sleep"
                    ]
                },
                {
                    label: "Adverb + Adjective",
                    formula: "adverb + adjective",
                    examples: [
                        "highly effective",
                        "deeply concerned",
                        "strongly recommended"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A collocation is...",
            options: [
                "a natural combination of words",
                "a punctuation mark",
                "a verb tense",
                "a type of article"
            ],
            answer: "a natural combination of words",
            explanation: "Collocation adalah kombinasi kata yang lazim digunakan bersama."
        },
        {
            type: "Verb + Noun",
            question: "Which collocation is natural?",
            options: [
                "make a decision",
                "do a decision",
                "take a decision strongly",
                "create a decision loudly"
            ],
            answer: "make a decision",
            explanation: "Collocation yang natural adalah make a decision."
        },
        {
            type: "Verb + Noun",
            question: "Which phrase is natural?",
            options: [
                "take a break",
                "make a break",
                "do a break",
                "strong a break"
            ],
            answer: "take a break",
            explanation: "Take a break berarti beristirahat sebentar."
        },
        {
            type: "Adjective + Noun",
            question: "Which collocation is natural?",
            options: [
                "heavy rain",
                "strong rain",
                "powerful rain",
                "hard rainly"
            ],
            answer: "heavy rain",
            explanation: "Heavy rain adalah collocation natural untuk hujan deras."
        },
        {
            type: "Adjective + Noun",
            question: "Which phrase sounds natural?",
            options: [
                "strong coffee",
                "powerful coffee",
                "heavy coffee",
                "hard coffee"
            ],
            answer: "strong coffee",
            explanation: "Strong coffee berarti kopi yang pekat."
        },
        {
            type: "Adverb + Adjective",
            question: "Which collocation is natural?",
            options: [
                "highly effective",
                "very effectively",
                "strong effective",
                "heavy effective"
            ],
            answer: "highly effective",
            explanation: "Highly effective adalah adverb + adjective collocation."
        },
        {
            type: "Natural English",
            question: "Which sentence sounds most natural?",
            options: [
                "We need to make a decision today.",
                "We need to do a decision today.",
                "We need to take a decision loudly today.",
                "We need to strong a decision today."
            ],
            answer: "We need to make a decision today.",
            explanation: "Make a decision adalah collocation yang tepat."
        },
        {
            type: "Natural English",
            question: "Which sentence is natural?",
            options: [
                "There was heavy rain last night.",
                "There was powerful rain last night.",
                "There was strong rainly last night.",
                "There was hard raining noun last night."
            ],
            answer: "There was heavy rain last night.",
            explanation: "Heavy rain adalah kombinasi kata yang natural."
        },
        {
            type: "Concept",
            question: "Collocations are important because they make English sound...",
            options: [
                "natural",
                "random",
                "translated word by word",
                "less accurate"
            ],
            answer: "natural",
            explanation: "Collocation membuat Bahasa Inggris terdengar lebih natural."
        },
        {
            type: "Final",
            question: "Which phrase is NOT a natural collocation?",
            options: [
                "do a decision",
                "make a decision",
                "heavy rain",
                "strong coffee"
            ],
            answer: "do a decision",
            explanation: "Yang benar adalah make a decision, bukan do a decision."
        }
    ]
}, 

"verb-noun-collocations": {
    title: "Verb + Noun Collocations",
    description: "Verb + Noun Collocations adalah kombinasi alami antara verb dan noun. Kombinasi ini penting karena tidak semua verb bisa dipasangkan secara bebas dengan noun tertentu.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Verb + Noun = Natural Action Phrase
    `,

    notes: [
        "Make a decision berarti membuat keputusan.",
        "Do homework berarti mengerjakan PR.",
        "Take a break berarti beristirahat sebentar.",
        "Have a conversation berarti melakukan percakapan.",
        "Give advice berarti memberi nasihat.",
        "Pay attention berarti memperhatikan.",
        "Keep a promise berarti menepati janji.",
        "Break a habit berarti menghentikan kebiasaan."
    ],

    patterns: [
        {
            group: "Make / Do",
            items: [
                {
                    label: "Make",
                    formula: "make + noun",
                    examples: [
                        "make a decision",
                        "make a mistake",
                        "make progress"
                    ]
                },
                {
                    label: "Do",
                    formula: "do + noun",
                    examples: [
                        "do homework",
                        "do business",
                        "do research"
                    ]
                }
            ]
        },
        {
            group: "Take / Have / Give",
            items: [
                {
                    label: "Common Actions",
                    formula: "take/have/give + noun",
                    examples: [
                        "take a break",
                        "have a conversation",
                        "give advice"
                    ]
                }
            ]
        },
        {
            group: "Pay / Keep / Break",
            items: [
                {
                    label: "Fixed Collocations",
                    formula: "pay/keep/break + noun",
                    examples: [
                        "pay attention",
                        "keep a promise",
                        "break a habit"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Make",
            question: "We need to ___ a decision today.",
            options: ["make", "do", "take", "give"],
            answer: "make",
            explanation: "Collocation yang benar adalah make a decision."
        },
        {
            type: "Make",
            question: "She ___ a mistake in the report.",
            options: ["made", "did", "took", "gave"],
            answer: "made",
            explanation: "Collocation yang benar adalah make a mistake."
        },
        {
            type: "Make",
            question: "He is making good ___ in English.",
            options: ["progress", "homework", "attention", "advice"],
            answer: "progress",
            explanation: "Make progress berarti mengalami kemajuan."
        },
        {
            type: "Do",
            question: "I have to ___ my homework.",
            options: ["do", "make", "take", "give"],
            answer: "do",
            explanation: "Collocation yang benar adalah do homework."
        },
        {
            type: "Do",
            question: "They ___ business with foreign companies.",
            options: ["do", "make", "take", "keep"],
            answer: "do",
            explanation: "Do business adalah collocation natural."
        },
        {
            type: "Take",
            question: "Let's ___ a break.",
            options: ["take", "make", "do", "pay"],
            answer: "take",
            explanation: "Take a break berarti beristirahat sebentar."
        },
        {
            type: "Have",
            question: "We had a long ___ about the project.",
            options: ["conversation", "homework", "attention", "mistake"],
            answer: "conversation",
            explanation: "Have a conversation berarti melakukan percakapan."
        },
        {
            type: "Give",
            question: "Can you ___ me some advice?",
            options: ["give", "make", "do", "break"],
            answer: "give",
            explanation: "Give advice berarti memberi nasihat."
        },
        {
            type: "Pay",
            question: "Please ___ attention to the instructions.",
            options: ["pay", "make", "do", "take"],
            answer: "pay",
            explanation: "Pay attention berarti memperhatikan."
        },
        {
            type: "Keep",
            question: "You should ___ your promise.",
            options: ["keep", "make", "do", "give"],
            answer: "keep",
            explanation: "Keep a promise berarti menepati janji."
        },
        {
            type: "Break",
            question: "He wants to ___ a bad habit.",
            options: ["break", "make", "pay", "give"],
            answer: "break",
            explanation: "Break a habit berarti menghentikan kebiasaan."
        },
        {
            type: "Error Check",
            question: "Which phrase is natural?",
            options: [
                "make a decision",
                "do a decision",
                "give a decision",
                "pay a decision"
            ],
            answer: "make a decision",
            explanation: "Make a decision adalah collocation yang benar."
        }
    ]
},

"adjective-noun-collocations": {
    title: "Adjective + Noun Collocations",
    description: "Adjective + Noun Collocations adalah kombinasi alami antara adjective dan noun. Kombinasi ini membuat kalimat terdengar lebih natural dan tidak seperti terjemahan langsung.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Adjective + Noun = Natural Description
    `,

    notes: [
        "Heavy rain berarti hujan deras.",
        "Strong coffee berarti kopi pekat.",
        "Deep sleep berarti tidur nyenyak.",
        "High quality berarti kualitas tinggi.",
        "Serious problem berarti masalah serius.",
        "Major issue berarti isu besar.",
        "Great opportunity berarti kesempatan besar.",
        "Common mistake berarti kesalahan umum."
    ],

    patterns: [
        {
            group: "Weather / Drink / Sleep",
            items: [
                {
                    label: "Natural Pairs",
                    formula: "adjective + noun",
                    examples: [
                        "heavy rain",
                        "strong coffee",
                        "deep sleep"
                    ]
                }
            ]
        },
        {
            group: "Quality / Problem",
            items: [
                {
                    label: "Formal Collocations",
                    formula: "adjective + noun",
                    examples: [
                        "high quality",
                        "serious problem",
                        "major issue"
                    ]
                }
            ]
        },
        {
            group: "Opportunity / Mistake",
            items: [
                {
                    label: "Common Usage",
                    formula: "adjective + noun",
                    examples: [
                        "great opportunity",
                        "common mistake",
                        "important decision"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Weather",
            question: "There was ___ rain last night.",
            options: ["heavy", "strong", "powerful", "hardly"],
            answer: "heavy",
            explanation: "Collocation yang natural adalah heavy rain."
        },
        {
            type: "Drink",
            question: "I need a cup of ___ coffee.",
            options: ["strong", "heavy", "powerful", "deep"],
            answer: "strong",
            explanation: "Strong coffee berarti kopi pekat."
        },
        {
            type: "Sleep",
            question: "After the trip, he fell into a ___ sleep.",
            options: ["deep", "heavy", "strong", "large"],
            answer: "deep",
            explanation: "Deep sleep berarti tidur nyenyak."
        },
        {
            type: "Quality",
            question: "This company produces ___ quality products.",
            options: ["high", "tall", "deep", "heavy"],
            answer: "high",
            explanation: "High quality adalah collocation natural."
        },
        {
            type: "Problem",
            question: "Pollution is a ___ problem in many cities.",
            options: ["serious", "strong", "deep", "heavy"],
            answer: "serious",
            explanation: "Serious problem berarti masalah serius."
        },
        {
            type: "Issue",
            question: "Climate change is a ___ issue.",
            options: ["major", "tall", "powerful", "hardly"],
            answer: "major",
            explanation: "Major issue berarti isu besar."
        },
        {
            type: "Opportunity",
            question: "This scholarship is a ___ opportunity.",
            options: ["great", "heavy", "deep", "strong"],
            answer: "great",
            explanation: "Great opportunity berarti kesempatan besar."
        },
        {
            type: "Mistake",
            question: "Using 'do a decision' is a ___ mistake.",
            options: ["common", "tall", "deep", "heavy"],
            answer: "common",
            explanation: "Common mistake berarti kesalahan umum."
        },
        {
            type: "Decision",
            question: "Choosing a university is an ___ decision.",
            options: ["important", "heavily", "strongly", "deeply"],
            answer: "important",
            explanation: "Important decision adalah adjective + noun collocation."
        },
        {
            type: "Error Check",
            question: "Which phrase is natural?",
            options: [
                "heavy rain",
                "powerful rain",
                "strong rain",
                "deep rain"
            ],
            answer: "heavy rain",
            explanation: "Heavy rain adalah collocation yang benar."
        }
    ]
},

"adverb-adjective-collocations": {
    title: "Adverb + Adjective Collocations",
    description: "Adverb + Adjective Collocations adalah kombinasi alami antara adverb dan adjective. Pola ini sering digunakan untuk memperkuat makna adjective dalam speaking, writing, academic English, dan formal communication.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Adverb + Adjective = Stronger / More Precise Description
    `,

    notes: [
        "Highly effective berarti sangat efektif.",
        "Deeply concerned berarti sangat prihatin.",
        "Strongly recommended berarti sangat direkomendasikan.",
        "Fully aware berarti sepenuhnya sadar.",
        "Completely different berarti sangat berbeda.",
        "Widely available berarti tersedia secara luas.",
        "Closely related berarti berhubungan erat.",
        "Perfectly clear berarti sangat jelas."
    ],

    patterns: [
        {
            group: "Formal / Academic",
            items: [
                {
                    label: "Highly / Strongly",
                    formula: "highly/strongly + adjective",
                    examples: [
                        "highly effective",
                        "highly significant",
                        "strongly recommended"
                    ]
                }
            ]
        },
        {
            group: "Degree",
            items: [
                {
                    label: "Fully / Completely / Perfectly",
                    formula: "degree adverb + adjective",
                    examples: [
                        "fully aware",
                        "completely different",
                        "perfectly clear"
                    ]
                }
            ]
        },
        {
            group: "Relationship / Availability",
            items: [
                {
                    label: "Closely / Widely / Deeply",
                    formula: "adverb + adjective",
                    examples: [
                        "closely related",
                        "widely available",
                        "deeply concerned"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Highly",
            question: "This method is ___ effective.",
            options: ["highly", "deep", "strong", "wide"],
            answer: "highly",
            explanation: "Highly effective adalah collocation natural."
        },
        {
            type: "Significant",
            question: "The result is ___ significant.",
            options: ["highly", "heavy", "deep", "strong"],
            answer: "highly",
            explanation: "Highly significant sering digunakan dalam academic English."
        },
        {
            type: "Recommended",
            question: "This book is ___ recommended.",
            options: ["strongly", "deep", "wide", "heavy"],
            answer: "strongly",
            explanation: "Strongly recommended berarti sangat direkomendasikan."
        },
        {
            type: "Aware",
            question: "She is ___ aware of the risks.",
            options: ["fully", "strong", "heavy", "large"],
            answer: "fully",
            explanation: "Fully aware berarti sepenuhnya sadar."
        },
        {
            type: "Different",
            question: "Their opinions are ___ different.",
            options: ["completely", "heavy", "strong", "wide"],
            answer: "completely",
            explanation: "Completely different berarti sangat berbeda."
        },
        {
            type: "Clear",
            question: "The instructions are ___ clear.",
            options: ["perfectly", "heavy", "deep", "large"],
            answer: "perfectly",
            explanation: "Perfectly clear berarti sangat jelas."
        },
        {
            type: "Related",
            question: "These two issues are ___ related.",
            options: ["closely", "heavy", "strong", "large"],
            answer: "closely",
            explanation: "Closely related berarti berhubungan erat."
        },
        {
            type: "Available",
            question: "The product is ___ available.",
            options: ["widely", "deep", "strong", "heavy"],
            answer: "widely",
            explanation: "Widely available berarti tersedia secara luas."
        },
        {
            type: "Concerned",
            question: "The committee is ___ concerned about the issue.",
            options: ["deeply", "heavy", "wide", "large"],
            answer: "deeply",
            explanation: "Deeply concerned berarti sangat prihatin."
        },
        {
            type: "Error Check",
            question: "Which phrase is natural?",
            options: [
                "highly effective",
                "heavy effective",
                "strong effective",
                "deep effective"
            ],
            answer: "highly effective",
            explanation: "Highly effective adalah adverb + adjective collocation yang benar."
        }
    ]
},

"business-academic-collocations": {
    title: "Business & Academic Collocations",
    description: "Business & Academic Collocations adalah kombinasi kata yang sering digunakan dalam dunia kerja, laporan, presentasi, academic writing, IELTS, TOEFL, dan komunikasi profesional.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Professional Context + Natural Word Combination
    `,

    notes: [
        "Conduct research berarti melakukan penelitian.",
        "Draw a conclusion berarti menarik kesimpulan.",
        "Reach an agreement berarti mencapai kesepakatan.",
        "Meet a deadline berarti memenuhi tenggat waktu.",
        "Make a contribution berarti memberi kontribusi.",
        "Play a role berarti berperan.",
        "Provide evidence berarti menyediakan bukti.",
        "Address an issue berarti menangani isu."
    ],

    patterns: [
        {
            group: "Academic Writing",
            items: [
                {
                    label: "Research / Evidence",
                    formula: "academic verb + noun",
                    examples: [
                        "conduct research",
                        "provide evidence",
                        "draw a conclusion"
                    ]
                }
            ]
        },
        {
            group: "Business Communication",
            items: [
                {
                    label: "Agreement / Deadline",
                    formula: "business verb + noun",
                    examples: [
                        "reach an agreement",
                        "meet a deadline",
                        "make a contribution"
                    ]
                }
            ]
        },
        {
            group: "Professional Discussion",
            items: [
                {
                    label: "Role / Issue",
                    formula: "verb + professional noun",
                    examples: [
                        "play a role",
                        "address an issue",
                        "raise a concern"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Academic",
            question: "Researchers need to ___ research before making claims.",
            options: ["conduct", "make", "do", "take"],
            answer: "conduct",
            explanation: "Conduct research adalah collocation formal dan akademik."
        },
        {
            type: "Academic",
            question: "The article provides strong ___.",
            options: ["evidence", "decision", "deadline", "coffee"],
            answer: "evidence",
            explanation: "Provide evidence berarti menyediakan bukti."
        },
        {
            type: "Academic",
            question: "Based on the data, we can ___ a conclusion.",
            options: ["draw", "make", "do", "take"],
            answer: "draw",
            explanation: "Draw a conclusion berarti menarik kesimpulan."
        },
        {
            type: "Business",
            question: "Both companies finally reached an ___.",
            options: ["agreement", "homework", "rain", "sleep"],
            answer: "agreement",
            explanation: "Reach an agreement berarti mencapai kesepakatan."
        },
        {
            type: "Business",
            question: "We must ___ the deadline.",
            options: ["meet", "make", "do", "give"],
            answer: "meet",
            explanation: "Meet a deadline berarti memenuhi tenggat waktu."
        },
        {
            type: "Business",
            question: "She made an important ___ to the project.",
            options: ["contribution", "deadline", "rain", "mistake"],
            answer: "contribution",
            explanation: "Make a contribution berarti memberi kontribusi."
        },
        {
            type: "Professional",
            question: "Technology plays a major ___ in education.",
            options: ["role", "agreement", "deadline", "coffee"],
            answer: "role",
            explanation: "Play a role berarti berperan."
        },
        {
            type: "Professional",
            question: "The manager addressed the ___ during the meeting.",
            options: ["issue", "sleep", "coffee", "rain"],
            answer: "issue",
            explanation: "Address an issue berarti menangani isu."
        },
        {
            type: "Professional",
            question: "Several employees raised a ___ about the new policy.",
            options: ["concern", "deadline", "research", "sleep"],
            answer: "concern",
            explanation: "Raise a concern berarti menyampaikan kekhawatiran."
        },
        {
            type: "Error Check",
            question: "Which phrase is most appropriate for academic writing?",
            options: [
                "conduct research",
                "make research",
                "take research",
                "give research"
            ],
            answer: "conduct research",
            explanation: "Conduct research adalah collocation akademik yang tepat."
        }
    ]
},

"collocations-review": {
    title: "Collocations Review",
    description: "Review akhir untuk menguji seluruh materi Collocations, termasuk verb + noun, adjective + noun, adverb + adjective, serta business dan academic collocations.",

    formula: `
        <strong>Ringkasan BAB 19:</strong><br>
        Collocation = Natural Word Combination<br>
        Verb + Noun<br>
        Adjective + Noun<br>
        Adverb + Adjective<br>
        Business & Academic Collocations
    `,

    notes: [
        "Collocation membuat Bahasa Inggris terdengar lebih natural.",
        "Make a decision lebih natural daripada do a decision.",
        "Heavy rain lebih natural daripada strong rain.",
        "Highly effective lebih natural daripada heavy effective.",
        "Conduct research lebih akademik daripada make research.",
        "Collocation penting untuk speaking, writing, IELTS, TOEFL, dan academic English."
    ],

    patterns: [
        {
            group: "Review",
            items: [
                {
                    label: "Verb + Noun",
                    formula: "verb + noun",
                    examples: [
                        "make a decision",
                        "take a break",
                        "pay attention"
                    ]
                },
                {
                    label: "Adjective + Noun",
                    formula: "adjective + noun",
                    examples: [
                        "heavy rain",
                        "strong coffee",
                        "serious problem"
                    ]
                },
                {
                    label: "Academic Collocations",
                    formula: "formal verb + noun",
                    examples: [
                        "conduct research",
                        "provide evidence",
                        "draw a conclusion"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "A collocation is...",
            options: [
                "a natural combination of words",
                "a punctuation mark",
                "a tense form",
                "a type of article"
            ],
            answer: "a natural combination of words",
            explanation: "Collocation adalah kombinasi kata yang lazim digunakan bersama."
        },
        {
            type: "Verb + Noun",
            question: "We need to ___ a decision.",
            options: ["make", "do", "take", "give"],
            answer: "make",
            explanation: "Collocation yang benar adalah make a decision."
        },
        {
            type: "Verb + Noun",
            question: "Please ___ attention to the instructions.",
            options: ["pay", "make", "do", "take"],
            answer: "pay",
            explanation: "Pay attention berarti memperhatikan."
        },
        {
            type: "Verb + Noun",
            question: "Let's ___ a break.",
            options: ["take", "make", "do", "pay"],
            answer: "take",
            explanation: "Take a break berarti beristirahat sebentar."
        },
        {
            type: "Adjective + Noun",
            question: "There was ___ rain last night.",
            options: ["heavy", "strong", "powerful", "deep"],
            answer: "heavy",
            explanation: "Heavy rain adalah collocation natural."
        },
        {
            type: "Adjective + Noun",
            question: "I need ___ coffee this morning.",
            options: ["strong", "heavy", "powerful", "deep"],
            answer: "strong",
            explanation: "Strong coffee berarti kopi pekat."
        },
        {
            type: "Adjective + Noun",
            question: "Pollution is a ___ problem.",
            options: ["serious", "strong", "heavy", "deep"],
            answer: "serious",
            explanation: "Serious problem adalah collocation yang benar."
        },
        {
            type: "Adverb + Adjective",
            question: "This method is ___ effective.",
            options: ["highly", "heavy", "strong", "deep"],
            answer: "highly",
            explanation: "Highly effective adalah collocation natural."
        },
        {
            type: "Adverb + Adjective",
            question: "The two issues are ___ related.",
            options: ["closely", "heavy", "strong", "large"],
            answer: "closely",
            explanation: "Closely related berarti berhubungan erat."
        },
        {
            type: "Adverb + Adjective",
            question: "She is ___ aware of the risks.",
            options: ["fully", "heavy", "deep", "large"],
            answer: "fully",
            explanation: "Fully aware berarti sepenuhnya sadar."
        },
        {
            type: "Academic",
            question: "Researchers should ___ research before making claims.",
            options: ["conduct", "make", "take", "give"],
            answer: "conduct",
            explanation: "Conduct research adalah collocation akademik."
        },
        {
            type: "Academic",
            question: "The data provides strong ___.",
            options: ["evidence", "deadline", "coffee", "sleep"],
            answer: "evidence",
            explanation: "Provide evidence berarti menyediakan bukti."
        },
        {
            type: "Academic",
            question: "Based on the findings, we can ___ a conclusion.",
            options: ["draw", "make", "do", "take"],
            answer: "draw",
            explanation: "Draw a conclusion berarti menarik kesimpulan."
        },
        {
            type: "Business",
            question: "We must ___ the deadline.",
            options: ["meet", "make", "do", "give"],
            answer: "meet",
            explanation: "Meet a deadline berarti memenuhi tenggat waktu."
        },
        {
            type: "Business",
            question: "Both sides reached an ___.",
            options: ["agreement", "homework", "rain", "sleep"],
            answer: "agreement",
            explanation: "Reach an agreement berarti mencapai kesepakatan."
        },
        {
            type: "Business",
            question: "The manager addressed the ___ during the meeting.",
            options: ["issue", "coffee", "sleep", "rain"],
            answer: "issue",
            explanation: "Address an issue berarti menangani isu."
        },
        {
            type: "Error Check",
            question: "Which phrase is natural?",
            options: [
                "make a decision",
                "do a decision",
                "pay a decision",
                "strong a decision"
            ],
            answer: "make a decision",
            explanation: "Make a decision adalah collocation yang benar."
        },
        {
            type: "Error Check",
            question: "Which phrase is natural?",
            options: [
                "heavy rain",
                "powerful rain",
                "strong rain",
                "deep rain"
            ],
            answer: "heavy rain",
            explanation: "Heavy rain adalah kombinasi kata yang natural."
        },
        {
            type: "Error Check",
            question: "Which phrase is best for academic writing?",
            options: [
                "conduct research",
                "make research",
                "take research",
                "give research"
            ],
            answer: "conduct research",
            explanation: "Conduct research adalah collocation akademik yang tepat."
        },
        {
            type: "Final",
            question: "Which sentence sounds most natural?",
            options: [
                "The study provides strong evidence and draws a clear conclusion.",
                "The study gives heavy evidence and makes a strong conclusion.",
                "The study does evidence and takes a conclusion.",
                "The study makes evidence and gives a conclusion strongly."
            ],
            answer: "The study provides strong evidence and draws a clear conclusion.",
            explanation: "Provide evidence dan draw a conclusion adalah collocations yang natural dan akademik."
        }
    ]
},

"academic-vocabulary": {
    title: "Introduction to Academic Vocabulary",
    description: "Academic Vocabulary adalah kosakata yang umum digunakan dalam tulisan formal, artikel ilmiah, laporan, esai, IELTS, TOEFL, dan komunikasi profesional. Kosakata akademik membantu tulisan terdengar lebih objektif, tepat, dan kredibel.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Academic Vocabulary = Formal + Precise + Objective Word Choice
    `,

    notes: [
        "Academic vocabulary lebih formal daripada kosakata percakapan sehari-hari.",
        "Academic vocabulary membantu menyampaikan ide secara objektif.",
        "Kata seperti analyze, indicate, significant, factor, method, dan evidence sering muncul dalam academic writing.",
        "Hindari kata yang terlalu informal seperti stuff, thing, a lot, kids, dan get.",
        "Gunakan kata yang lebih spesifik agar makna kalimat lebih jelas.",
        "Pemilihan kata yang tepat meningkatkan kualitas writing."
    ],

    patterns: [
        {
            group: "Formal Academic Words",
            items: [
                {
                    label: "Common Academic Verbs",
                    formula: "formal verb",
                    examples: [
                        "analyze",
                        "indicate",
                        "demonstrate",
                        "evaluate"
                    ]
                },
                {
                    label: "Common Academic Nouns",
                    formula: "formal noun",
                    examples: [
                        "factor",
                        "method",
                        "evidence",
                        "research"
                    ]
                },
                {
                    label: "Common Academic Adjectives",
                    formula: "formal adjective",
                    examples: [
                        "significant",
                        "relevant",
                        "effective",
                        "consistent"
                    ]
                }
            ]
        },
        {
            group: "Informal to Academic",
            items: [
                {
                    label: "Word Choice",
                    formula: "informal word → academic word",
                    examples: [
                        "a lot of → numerous / many",
                        "kids → children",
                        "get → obtain / receive",
                        "show → indicate / demonstrate"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Academic vocabulary is mainly used in...",
            options: [
                "formal and academic writing",
                "slang conversation only",
                "emoji messages",
                "children's games only"
            ],
            answer: "formal and academic writing",
            explanation: "Academic vocabulary umum digunakan dalam esai, laporan, artikel ilmiah, IELTS, TOEFL, dan tulisan formal."
        },
        {
            type: "Concept",
            question: "Academic vocabulary helps writing sound more...",
            options: [
                "objective and precise",
                "random and informal",
                "childish",
                "unclear"
            ],
            answer: "objective and precise",
            explanation: "Kosakata akademik membuat tulisan lebih objektif, tepat, dan kredibel."
        },
        {
            type: "Verb",
            question: "Which word is more academic?",
            options: ["analyze", "look at", "check out", "mess around"],
            answer: "analyze",
            explanation: "Analyze lebih formal dan akademik daripada look at atau check out."
        },
        {
            type: "Verb",
            question: "Which word is more academic?",
            options: ["indicate", "show", "tell", "say"],
            answer: "indicate",
            explanation: "Indicate lebih formal daripada show/tell/say dalam academic writing."
        },
        {
            type: "Noun",
            question: "Which word is common in academic writing?",
            options: ["evidence", "stuff", "thingy", "buddy"],
            answer: "evidence",
            explanation: "Evidence adalah noun akademik yang sering digunakan."
        },
        {
            type: "Noun",
            question: "Which word is more formal?",
            options: ["children", "kids", "guys", "dudes"],
            answer: "children",
            explanation: "Children lebih formal daripada kids."
        },
        {
            type: "Adjective",
            question: "Which adjective is academic?",
            options: ["significant", "cool", "awesome", "super"],
            answer: "significant",
            explanation: "Significant sering digunakan dalam tulisan akademik."
        },
        {
            type: "Word Choice",
            question: "A more academic replacement for 'a lot of' is...",
            options: ["numerous", "cool", "stuff", "kinda"],
            answer: "numerous",
            explanation: "Numerous lebih formal daripada a lot of."
        },
        {
            type: "Word Choice",
            question: "A more academic replacement for 'get data' is...",
            options: [
                "obtain data",
                "grab data",
                "get stuff",
                "take thing"
            ],
            answer: "obtain data",
            explanation: "Obtain data lebih formal dan akademik."
        },
        {
            type: "Final",
            question: "Which sentence sounds most academic?",
            options: [
                "The results indicate a significant improvement.",
                "The results show a cool improvement.",
                "The results tell a lot of good stuff.",
                "The results are kinda nice."
            ],
            answer: "The results indicate a significant improvement.",
            explanation: "Indicate dan significant adalah pilihan kata akademik yang tepat."
        }
    ]
},

"formal-informal-words": {
    title: "Formal vs Informal Words",
    description: "Formal vs Informal Words membahas perbedaan kosakata yang digunakan dalam percakapan sehari-hari dan dalam penulisan akademik atau profesional. Memilih tingkat formalitas yang tepat akan membuat komunikasi lebih efektif sesuai konteks.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Informal Word → Formal Word
    `,

    notes: [
        "Gunakan formal words untuk academic writing, laporan, email profesional, dan penelitian.",
        "Informal words lebih cocok untuk percakapan sehari-hari.",
        "Hindari slang dalam tulisan akademik.",
        "Pilih kata yang lebih spesifik daripada kata umum.",
        "Formal English terdengar lebih objektif dan profesional."
    ],

    patterns: [
        {
            group: "Common Replacements",
            items: [
                {
                    label: "Daily → Academic",
                    formula: "informal → formal",
                    examples: [
                        "get → obtain",
                        "buy → purchase",
                        "help → assist",
                        "need → require"
                    ]
                }
            ]
        },
        {
            group: "Communication",
            items: [
                {
                    label: "Speaking vs Writing",
                    formula: "informal → formal",
                    examples: [
                        "show → demonstrate",
                        "tell → inform",
                        "find out → discover",
                        "leave out → omit"
                    ]
                }
            ]
        },
        {
            group: "Quantity & Quality",
            items: [
                {
                    label: "More Precise Words",
                    formula: "informal → formal",
                    examples: [
                        "a lot of → numerous",
                        "good → beneficial",
                        "bad → detrimental",
                        "big → substantial"
                    ]
                }
            ]
        },
        {
            group: "People",
            items: [
                {
                    label: "Formal References",
                    formula: "informal → formal",
                    examples: [
                        "kids → children",
                        "guys → people",
                        "boss → supervisor",
                        "old people → elderly people"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Verb",
            question: "Which is the most formal replacement for 'get'?",
            options: [
                "obtain",
                "grab",
                "pick up",
                "take"
            ],
            answer: "obtain",
            explanation: "Obtain adalah padanan formal dari get."
        },
        {
            type: "Verb",
            question: "Which word is more formal than 'help'?",
            options: [
                "assist",
                "aiding",
                "fix",
                "join"
            ],
            answer: "assist",
            explanation: "Assist sering digunakan dalam academic dan professional English."
        },
        {
            type: "Verb",
            question: "Which is the best academic replacement for 'show'?",
            options: [
                "demonstrate",
                "look",
                "watch",
                "displaying"
            ],
            answer: "demonstrate",
            explanation: "Demonstrate lebih formal daripada show."
        },
        {
            type: "Verb",
            question: "Which word is the most formal replacement for 'tell'?",
            options: [
                "inform",
                "talk",
                "say",
                "speak"
            ],
            answer: "inform",
            explanation: "Inform adalah pilihan formal."
        },
        {
            type: "Noun",
            question: "Which word is more formal?",
            options: [
                "children",
                "kids",
                "guys",
                "folks"
            ],
            answer: "children",
            explanation: "Children lebih formal daripada kids."
        },
        {
            type: "Quantity",
            question: "Which phrase is the most academic?",
            options: [
                "numerous studies",
                "a lot of studies",
                "lots of studies",
                "tons of studies"
            ],
            answer: "numerous studies",
            explanation: "Numerous studies sangat umum dalam academic writing."
        },
        {
            type: "Adjective",
            question: "Which adjective is more formal than 'good'?",
            options: [
                "beneficial",
                "nice",
                "cool",
                "awesome"
            ],
            answer: "beneficial",
            explanation: "Beneficial lebih akademik daripada good."
        },
        {
            type: "Adjective",
            question: "Which adjective is more formal than 'bad'?",
            options: [
                "detrimental",
                "terrible",
                "awful",
                "ugly"
            ],
            answer: "detrimental",
            explanation: "Detrimental sering digunakan dalam academic writing."
        },
        {
            type: "Sentence",
            question: "Which sentence is the most academic?",
            options: [
                "The researchers obtained sufficient evidence.",
                "The researchers got lots of stuff.",
                "The researchers grabbed many things.",
                "The researchers picked up some data."
            ],
            answer: "The researchers obtained sufficient evidence.",
            explanation: "Obtained dan evidence merupakan pilihan kata akademik."
        },
        {
            type: "Error Check",
            question: "Which sentence is the most appropriate for a research paper?",
            options: [
                "Numerous studies demonstrate significant improvements.",
                "Lots of studies show cool improvements.",
                "Many guys found awesome results.",
                "People got good stuff from the experiment."
            ],
            answer: "Numerous studies demonstrate significant improvements.",
            explanation: "Kalimat tersebut menggunakan kosakata formal dan akademik secara konsisten."
        }
    ]
},

"word-precision": {
    title: "Word Precision",
    description: "Word Precision adalah kemampuan memilih kata yang paling tepat untuk menyampaikan makna. Dalam academic writing dan komunikasi profesional, kata yang spesifik lebih baik daripada kata yang terlalu umum.",

    formula: `
        <strong>Inti Materi:</strong><br>
        General Word → Specific Word
    `,

    notes: [
        "Gunakan kata yang spesifik daripada kata umum.",
        "Kata yang presisi membuat tulisan lebih jelas.",
        "Hindari penggunaan thing, stuff, nice, good, bad jika ada pilihan yang lebih tepat.",
        "Word precision meningkatkan kualitas academic writing.",
        "Pilih kata sesuai konteks, bukan hanya sinonim."
    ],

    patterns: [
        {
            group: "General → Specific Verbs",
            items: [
                {
                    label: "Precise Verbs",
                    formula: "general → specific",
                    examples: [
                        "do → perform",
                        "make → produce",
                        "go → travel",
                        "use → utilize"
                    ]
                }
            ]
        },
        {
            group: "General → Specific Nouns",
            items: [
                {
                    label: "Precise Nouns",
                    formula: "general → specific",
                    examples: [
                        "thing → object",
                        "thing → factor",
                        "thing → issue",
                        "stuff → materials"
                    ]
                }
            ]
        },
        {
            group: "General → Specific Adjectives",
            items: [
                {
                    label: "Precise Adjectives",
                    formula: "general → specific",
                    examples: [
                        "good → effective",
                        "good → beneficial",
                        "bad → harmful",
                        "big → substantial"
                    ]
                }
            ]
        },
        {
            group: "Academic Examples",
            items: [
                {
                    label: "Better Academic Writing",
                    formula: "general sentence → precise sentence",
                    examples: [
                        "The results were good. → The results were significant.",
                        "There were many things. → Several factors were identified.",
                        "They used many things. → They utilized various methods."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Word precision means...",
            options: [
                "choosing the most accurate word",
                "using the longest word",
                "using difficult vocabulary only",
                "using informal expressions"
            ],
            answer: "choosing the most accurate word",
            explanation: "Word precision berarti memilih kata yang paling tepat sesuai konteks."
        },
        {
            type: "Verb",
            question: "Which word is more precise than 'do' in an academic report?",
            options: [
                "perform",
                "make",
                "go",
                "put"
            ],
            answer: "perform",
            explanation: "Perform lebih spesifik daripada do."
        },
        {
            type: "Verb",
            question: "Which word is more academic than 'use'?",
            options: [
                "utilize",
                "take",
                "keep",
                "hold"
            ],
            answer: "utilize",
            explanation: "Utilize sering digunakan dalam konteks akademik."
        },
        {
            type: "Noun",
            question: "Instead of 'thing', which word is more precise in a research paper?",
            options: [
                "factor",
                "item",
                "piece",
                "part"
            ],
            answer: "factor",
            explanation: "Factor lebih spesifik daripada thing dalam konteks penelitian."
        },
        {
            type: "Noun",
            question: "A more precise replacement for 'stuff' is...",
            options: [
                "materials",
                "things",
                "objects",
                "goods"
            ],
            answer: "materials",
            explanation: "Materials lebih tepat daripada stuff dalam konteks formal."
        },
        {
            type: "Adjective",
            question: "Which adjective is more precise than 'good' when describing a method?",
            options: [
                "effective",
                "nice",
                "cool",
                "great"
            ],
            answer: "effective",
            explanation: "Effective lebih tepat untuk menggambarkan metode."
        },
        {
            type: "Adjective",
            question: "Which adjective is more precise than 'bad'?",
            options: [
                "harmful",
                "ugly",
                "poor",
                "terrible"
            ],
            answer: "harmful",
            explanation: "Harmful menjelaskan dampak negatif dengan lebih spesifik."
        },
        {
            type: "Sentence",
            question: "Which sentence is more precise?",
            options: [
                "Several factors influenced the results.",
                "Several things influenced the results.",
                "Some stuff influenced the results.",
                "Many items influenced the results."
            ],
            answer: "Several factors influenced the results.",
            explanation: "Factors lebih spesifik daripada things."
        },
        {
            type: "Sentence",
            question: "Which sentence is more academic?",
            options: [
                "The researchers utilized various methods.",
                "The researchers used many things.",
                "The researchers did some stuff.",
                "The researchers got many tools."
            ],
            answer: "The researchers utilized various methods.",
            explanation: "Utilized dan methods merupakan pilihan kata yang lebih presisi."
        },
        {
            type: "Final",
            question: "Why is word precision important in academic writing?",
            options: [
                "It makes ideas clearer and more accurate.",
                "It always makes sentences longer.",
                "It replaces all simple words.",
                "It avoids using verbs."
            ],
            answer: "It makes ideas clearer and more accurate.",
            explanation: "Pemilihan kata yang tepat meningkatkan kejelasan dan akurasi tulisan."
        }
    ]
},

"avoiding-repetition": {
    title: "Avoiding Repetition",
    description: "Avoiding Repetition adalah teknik menghindari pengulangan kata yang berlebihan dalam sebuah tulisan. Penulis dapat menggunakan sinonim, pronoun, parafrasa, atau variasi struktur kalimat agar tulisan lebih alami dan mudah dibaca.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Repetition → Synonym / Pronoun / Paraphrase
    `,

    notes: [
        "Jangan mengulang kata yang sama terlalu sering dalam satu paragraf.",
        "Gunakan sinonim jika maknanya tetap sesuai konteks.",
        "Gunakan pronoun seperti it, they, this, these jika referensinya jelas.",
        "Parafrase membantu membuat tulisan lebih bervariasi.",
        "Variasi struktur kalimat juga dapat mengurangi repetisi.",
        "Academic writing menghargai variasi kosakata yang tetap konsisten maknanya."
    ],

    patterns: [
        {
            group: "Using Synonyms",
            items: [
                {
                    label: "Vocabulary Variation",
                    formula: "word → synonym",
                    examples: [
                        "important → significant",
                        "show → demonstrate",
                        "help → assist",
                        "improve → enhance"
                    ]
                }
            ]
        },
        {
            group: "Using Pronouns",
            items: [
                {
                    label: "Replace Repeated Nouns",
                    formula: "noun → pronoun",
                    examples: [
                        "The experiment was successful. It produced useful data.",
                        "The students completed the task. They submitted it on time.",
                        "The company launched a product. It became popular."
                    ]
                }
            ]
        },
        {
            group: "Paraphrasing",
            items: [
                {
                    label: "Different Wording",
                    formula: "same meaning, different expression",
                    examples: [
                        "The results show... → The findings indicate...",
                        "Many people think... → It is widely believed...",
                        "This study shows... → This research demonstrates..."
                    ]
                }
            ]
        },
        {
            group: "Sentence Variety",
            items: [
                {
                    label: "Structure Variation",
                    formula: "vary sentence openings",
                    examples: [
                        "The experiment produced positive results.",
                        "Positive results were produced by the experiment.",
                        "Overall, the experiment produced positive results."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "The main purpose of avoiding repetition is to...",
            options: [
                "make writing more natural and readable",
                "make writing longer",
                "use difficult words only",
                "avoid using verbs"
            ],
            answer: "make writing more natural and readable",
            explanation: "Menghindari repetisi membuat tulisan lebih nyaman dibaca."
        },
        {
            type: "Synonym",
            question: "Which word is a better synonym for 'important' in academic writing?",
            options: [
                "significant",
                "cool",
                "nice",
                "great"
            ],
            answer: "significant",
            explanation: "Significant adalah sinonim formal untuk important."
        },
        {
            type: "Synonym",
            question: "Which word can replace 'show' in academic writing?",
            options: [
                "demonstrate",
                "watch",
                "look",
                "tell"
            ],
            answer: "demonstrate",
            explanation: "Demonstrate adalah pilihan yang lebih akademik."
        },
        {
            type: "Pronoun",
            question: "The company launched a new product. ___ became very popular.",
            options: [
                "It",
                "They",
                "He",
                "We"
            ],
            answer: "It",
            explanation: "It menggantikan 'the product'."
        },
        {
            type: "Pronoun",
            question: "The students finished the project. ___ presented it confidently.",
            options: [
                "They",
                "It",
                "She",
                "He"
            ],
            answer: "They",
            explanation: "They menggantikan 'the students'."
        },
        {
            type: "Paraphrase",
            question: "Which sentence avoids repetition best?",
            options: [
                "The findings indicate that the treatment was effective.",
                "The results show that the results show improvement.",
                "The results show that the results show success.",
                "The results show results."
            ],
            answer: "The findings indicate that the treatment was effective.",
            explanation: "Findings dan indicate mengurangi repetisi."
        },
        {
            type: "Sentence Variety",
            question: "Which sentence shows better variety?",
            options: [
                "Overall, the experiment produced positive results.",
                "The experiment produced positive results. The experiment produced positive results.",
                "The experiment produced results. The experiment produced results.",
                "The experiment. The experiment."
            ],
            answer: "Overall, the experiment produced positive results.",
            explanation: "Variasi struktur membuat tulisan lebih alami."
        },
        {
            type: "Academic",
            question: "Which sentence is more academic?",
            options: [
                "This research demonstrates significant improvements.",
                "This study shows good stuff.",
                "This thing shows nice results.",
                "This paper is really cool."
            ],
            answer: "This research demonstrates significant improvements.",
            explanation: "Research, demonstrates, dan significant adalah pilihan akademik."
        },
        {
            type: "Word Choice",
            question: "A good way to avoid repetition is to use...",
            options: [
                "synonyms and pronouns",
                "random slang",
                "emoji",
                "capital letters"
            ],
            answer: "synonyms and pronouns",
            explanation: "Sinonim dan pronoun membantu mengurangi pengulangan."
        },
        {
            type: "Final",
            question: "Which paragraph is better?",
            options: [
                "The study investigated the problem. The findings indicate a significant improvement. These results support the hypothesis.",
                "The study studied the study. The study showed the study. The study was good.",
                "The thing showed many things. Those things were good things.",
                "The research was research and showed research."
            ],
            answer: "The study investigated the problem. The findings indicate a significant improvement. These results support the hypothesis.",
            explanation: "Paragraf pertama menggunakan variasi kosakata dan struktur sehingga lebih natural dan akademik."
        }
    ]
},

"academic-word-list": {
    title: "Academic Word List (AWL)",
    description: "Academic Word List (AWL) adalah kumpulan kosakata akademik yang paling sering muncul dalam jurnal ilmiah, buku akademik, esai, IELTS, TOEFL, dan penelitian. Menguasai AWL akan meningkatkan kemampuan membaca, menulis, dan memahami teks akademik.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Academic Word = High-Frequency Academic Vocabulary
    `,

    notes: [
        "AWL dikembangkan oleh Averil Coxhead.",
        "Kata-kata AWL muncul di berbagai disiplin ilmu.",
        "AWL tidak termasuk kosakata dasar yang sangat umum.",
        "Menguasai AWL membantu meningkatkan skor IELTS dan TOEFL.",
        "Satu kata AWL sering memiliki beberapa bentuk (noun, verb, adjective, adverb).",
        "Fokuslah pada penggunaan kata dalam konteks, bukan sekadar menghafal."
    ],

    patterns: [
        {
            group: "Common Academic Verbs",
            items: [
                {
                    label: "Academic Verbs",
                    formula: "verb",
                    examples: [
                        "analyze",
                        "assess",
                        "establish",
                        "identify"
                    ]
                }
            ]
        },
        {
            group: "Common Academic Nouns",
            items: [
                {
                    label: "Academic Nouns",
                    formula: "noun",
                    examples: [
                        "approach",
                        "concept",
                        "context",
                        "factor"
                    ]
                }
            ]
        },
        {
            group: "Common Academic Adjectives",
            items: [
                {
                    label: "Academic Adjectives",
                    formula: "adjective",
                    examples: [
                        "significant",
                        "relevant",
                        "consistent",
                        "appropriate"
                    ]
                }
            ]
        },
        {
            group: "Word Families",
            items: [
                {
                    label: "Same Root",
                    formula: "noun / verb / adjective",
                    examples: [
                        "analyze → analysis → analytical",
                        "identify → identification → identifiable",
                        "signify → significance → significant"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "The Academic Word List (AWL) contains...",
            options: [
                "high-frequency academic vocabulary",
                "only slang words",
                "only phrasal verbs",
                "children's vocabulary"
            ],
            answer: "high-frequency academic vocabulary",
            explanation: "AWL berisi kosakata akademik yang sering muncul dalam berbagai bidang ilmu."
        },
        {
            type: "Concept",
            question: "AWL is especially useful for...",
            options: [
                "academic reading and writing",
                "comic books only",
                "video game dialogue",
                "emoji messages"
            ],
            answer: "academic reading and writing",
            explanation: "AWL membantu memahami dan menulis teks akademik."
        },
        {
            type: "Verb",
            question: "Which word is an academic verb?",
            options: [
                "analyze",
                "grab",
                "hang",
                "chill"
            ],
            answer: "analyze",
            explanation: "Analyze adalah salah satu kata penting dalam AWL."
        },
        {
            type: "Verb",
            question: "Which word is commonly used to evaluate information?",
            options: [
                "assess",
                "play",
                "carry",
                "bring"
            ],
            answer: "assess",
            explanation: "Assess berarti menilai atau mengevaluasi."
        },
        {
            type: "Noun",
            question: "Which is an academic noun?",
            options: [
                "concept",
                "stuff",
                "thing",
                "kid"
            ],
            answer: "concept",
            explanation: "Concept adalah noun yang sering muncul dalam tulisan akademik."
        },
        {
            type: "Noun",
            question: "Which word refers to something that influences a result?",
            options: [
                "factor",
                "guy",
                "thing",
                "item"
            ],
            answer: "factor",
            explanation: "Factor adalah istilah akademik yang umum."
        },
        {
            type: "Adjective",
            question: "Which adjective is commonly used in research papers?",
            options: [
                "significant",
                "awesome",
                "cool",
                "fun"
            ],
            answer: "significant",
            explanation: "Significant digunakan untuk menunjukkan hasil yang penting secara statistik atau praktis."
        },
        {
            type: "Word Family",
            question: "Which word belongs to the same family as 'analyze'?",
            options: [
                "analysis",
                "playing",
                "runner",
                "teacher"
            ],
            answer: "analysis",
            explanation: "Analysis adalah bentuk noun dari analyze."
        },
        {
            type: "Academic Usage",
            question: "Which sentence is the most academic?",
            options: [
                "The researchers analyzed the data and identified several significant factors.",
                "The researchers looked at the stuff and found cool things.",
                "The guys checked everything and got nice results.",
                "The team saw many things and said they were good."
            ],
            answer: "The researchers analyzed the data and identified several significant factors.",
            explanation: "Kalimat menggunakan beberapa kosakata inti dari AWL."
        },
        {
            type: "Final",
            question: "Why should students learn the Academic Word List?",
            options: [
                "It improves academic reading, writing, and vocabulary.",
                "It replaces all grammar rules.",
                "It is only useful for casual conversation.",
                "It removes the need to learn verbs."
            ],
            answer: "It improves academic reading, writing, and vocabulary.",
            explanation: "AWL membantu memahami dan menghasilkan teks akademik yang lebih baik."
        }
    ]
},

"academic-vocabulary-review": {
    title: "Academic Vocabulary Review",
    description: "Review akhir untuk menguji seluruh materi Academic Vocabulary & Word Choice, termasuk formal vs informal words, word precision, avoiding repetition, serta Academic Word List (AWL).",

    formula: `
        <strong>Ringkasan BAB 20:</strong><br>
        Academic Vocabulary = Formal + Precise + Objective<br>
        Formal vs Informal Words<br>
        Word Precision<br>
        Avoiding Repetition<br>
        Academic Word List (AWL)
    `,

    notes: [
        "Gunakan kosakata formal dalam academic writing.",
        "Pilih kata yang paling tepat sesuai konteks.",
        "Hindari pengulangan kata secara berlebihan.",
        "Gunakan sinonim, pronoun, dan parafrasa untuk variasi.",
        "Kuasai kosakata AWL untuk meningkatkan kemampuan membaca dan menulis akademik."
    ],

    patterns: [
        {
            group: "Academic Vocabulary",
            items: [
                {
                    label: "Formal Writing",
                    formula: "formal word choice",
                    examples: [
                        "obtain data",
                        "conduct research",
                        "significant findings"
                    ]
                },
                {
                    label: "Word Precision",
                    formula: "general → specific",
                    examples: [
                        "thing → factor",
                        "good → effective",
                        "show → demonstrate"
                    ]
                },
                {
                    label: "Avoid Repetition",
                    formula: "synonym / pronoun / paraphrase",
                    examples: [
                        "The findings indicate...",
                        "These results suggest...",
                        "It demonstrates..."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Academic vocabulary is mainly used in...",
            options: [
                "formal and academic writing",
                "text messages only",
                "slang conversations",
                "comic books"
            ],
            answer: "formal and academic writing",
            explanation: "Academic vocabulary digunakan dalam tulisan formal dan ilmiah."
        },
        {
            type: "Formal Word",
            question: "Which word is the most formal replacement for 'get'?",
            options: [
                "obtain",
                "grab",
                "pick up",
                "take"
            ],
            answer: "obtain",
            explanation: "Obtain lebih formal daripada get."
        },
        {
            type: "Formal Word",
            question: "Which word is more academic than 'show'?",
            options: [
                "demonstrate",
                "look",
                "watch",
                "see"
            ],
            answer: "demonstrate",
            explanation: "Demonstrate lebih formal dan umum dalam academic writing."
        },
        {
            type: "Precision",
            question: "Which noun is more precise than 'thing' in research writing?",
            options: [
                "factor",
                "item",
                "piece",
                "stuff"
            ],
            answer: "factor",
            explanation: "Factor lebih spesifik daripada thing."
        },
        {
            type: "Precision",
            question: "Which adjective is the best replacement for 'good' when describing a method?",
            options: [
                "effective",
                "nice",
                "cool",
                "great"
            ],
            answer: "effective",
            explanation: "Effective lebih tepat untuk menjelaskan kualitas suatu metode."
        },
        {
            type: "Repetition",
            question: "A good way to avoid repetition is to use...",
            options: [
                "synonyms and pronouns",
                "slang",
                "capital letters",
                "emoji"
            ],
            answer: "synonyms and pronouns",
            explanation: "Sinonim dan pronoun membantu membuat tulisan lebih bervariasi."
        },
        {
            type: "AWL",
            question: "Which word belongs to the Academic Word List?",
            options: [
                "analyze",
                "awesome",
                "cool",
                "buddy"
            ],
            answer: "analyze",
            explanation: "Analyze merupakan salah satu kosakata akademik yang umum."
        },
        {
            type: "AWL",
            question: "Which word is an academic adjective?",
            options: [
                "significant",
                "fun",
                "cool",
                "nice"
            ],
            answer: "significant",
            explanation: "Significant sering digunakan dalam penelitian dan artikel ilmiah."
        },
        {
            type: "Sentence",
            question: "Which sentence is the most academic?",
            options: [
                "The researchers conducted research and obtained sufficient evidence.",
                "The researchers did some stuff and got good things.",
                "The guys checked everything and found cool results.",
                "The team got lots of data and it was nice."
            ],
            answer: "The researchers conducted research and obtained sufficient evidence.",
            explanation: "Conducted, obtained, dan evidence merupakan pilihan kata akademik."
        },
        {
            type: "Sentence",
            question: "Which sentence demonstrates better word precision?",
            options: [
                "Several factors influenced the outcome.",
                "Several things influenced the outcome.",
                "Some stuff influenced the outcome.",
                "Many items influenced the outcome."
            ],
            answer: "Several factors influenced the outcome.",
            explanation: "Factors lebih presisi daripada things."
        },
        {
            type: "Sentence",
            question: "Which sentence avoids repetition best?",
            options: [
                "The study investigated the issue. The findings indicate significant improvements.",
                "The study studied the study. The study showed the study.",
                "The thing showed many things about the thing.",
                "The research research research research."
            ],
            answer: "The study investigated the issue. The findings indicate significant improvements.",
            explanation: "Menggunakan variasi kosakata dan struktur kalimat."
        },
        {
            type: "Formal Choice",
            question: "Which phrase is most appropriate in an academic report?",
            options: [
                "provide evidence",
                "show stuff",
                "get proof",
                "bring things"
            ],
            answer: "provide evidence",
            explanation: "Provide evidence adalah collocation akademik yang umum."
        },
        {
            type: "Vocabulary",
            question: "Which word is more formal than 'help'?",
            options: [
                "assist",
                "join",
                "fix",
                "save"
            ],
            answer: "assist",
            explanation: "Assist lebih formal daripada help."
        },
        {
            type: "Vocabulary",
            question: "Which phrase is more academic?",
            options: [
                "numerous studies",
                "lots of studies",
                "a bunch of studies",
                "many cool studies"
            ],
            answer: "numerous studies",
            explanation: "Numerous studies merupakan ekspresi yang umum dalam tulisan akademik."
        },
        {
            type: "Final",
            question: "Which paragraph is the most suitable for an academic journal?",
            options: [
                "The researchers analyzed the data, identified significant factors, and concluded that the proposed method was highly effective.",
                "The researchers looked at the stuff and found lots of good things.",
                "The guys checked everything and got awesome results.",
                "The team found cool information and said it was nice."
            ],
            answer: "The researchers analyzed the data, identified significant factors, and concluded that the proposed method was highly effective.",
            explanation: "Paragraf menggunakan kosakata formal, presisi, dan akademik secara konsisten."
        }
    ]
},

"writing-style": {
    title: "Introduction to Writing Style",
    description: "Writing Style adalah cara penulis menyusun kata, kalimat, dan paragraf agar ide tersampaikan dengan jelas, logis, dan sesuai konteks. Dalam academic writing, gaya bahasa harus objektif, formal, ringkas, dan terhubung dengan baik.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Good Writing Style = Clarity + Cohesion + Formality + Precision
    `,

    notes: [
        "Writing style menentukan bagaimana ide dibaca dan dipahami.",
        "Academic writing harus jelas, objektif, dan formal.",
        "Cohesion membantu kalimat dan paragraf saling terhubung.",
        "Coherence membuat alur ide mudah diikuti.",
        "Conciseness membuat tulisan lebih ringkas tanpa mengurangi makna.",
        "Hedging membuat klaim akademik terdengar lebih hati-hati dan objektif."
    ],

    patterns: [
        {
            group: "Core Elements",
            items: [
                {
                    label: "Clarity",
                    formula: "clear subject + clear verb + clear idea",
                    examples: [
                        "The study examines student motivation.",
                        "The results indicate a significant improvement.",
                        "The method provides reliable data."
                    ]
                },
                {
                    label: "Cohesion",
                    formula: "idea + connector + idea",
                    examples: [
                        "The task was difficult. However, the team completed it.",
                        "The data was incomplete. Therefore, further research is needed.",
                        "This method is simple. Moreover, it is effective."
                    ]
                },
                {
                    label: "Formal Tone",
                    formula: "informal word → formal word",
                    examples: [
                        "get → obtain",
                        "show → demonstrate",
                        "a lot of → numerous"
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Good writing style mainly requires...",
            options: ["clarity and logical connection", "long sentences only", "slang words", "random vocabulary"],
            answer: "clarity and logical connection",
            explanation: "Writing style yang baik harus jelas dan logis."
        },
        {
            type: "Academic Style",
            question: "Academic writing should usually be...",
            options: ["formal and objective", "very casual", "full of slang", "emotional only"],
            answer: "formal and objective",
            explanation: "Tulisan akademik biasanya formal, objektif, dan berbasis bukti."
        },
        {
            type: "Clarity",
            question: "Which sentence is clearer?",
            options: [
                "The study examines student motivation.",
                "The thing looks at student stuff.",
                "It does something about students.",
                "Student motivation thing is done."
            ],
            answer: "The study examines student motivation.",
            explanation: "Kalimat ini memiliki subject, verb, dan object yang jelas."
        },
        {
            type: "Cohesion",
            question: "Which word connects contrast?",
            options: ["However", "Therefore", "Moreover", "For example"],
            answer: "However",
            explanation: "However digunakan untuk menunjukkan kontras."
        },
        {
            type: "Cohesion",
            question: "Which word connects result?",
            options: ["Therefore", "However", "Moreover", "Although"],
            answer: "Therefore",
            explanation: "Therefore menunjukkan hasil atau akibat."
        },
        {
            type: "Formal Tone",
            question: "Which word is more formal than 'get'?",
            options: ["obtain", "grab", "pick up", "take"],
            answer: "obtain",
            explanation: "Obtain lebih formal daripada get."
        },
        {
            type: "Formal Tone",
            question: "Which word is more academic than 'show'?",
            options: ["demonstrate", "look", "watch", "say"],
            answer: "demonstrate",
            explanation: "Demonstrate lebih formal dan akademik."
        },
        {
            type: "Conciseness",
            question: "Conciseness means writing...",
            options: [
                "briefly without losing meaning",
                "as long as possible",
                "without grammar",
                "with repeated words"
            ],
            answer: "briefly without losing meaning",
            explanation: "Conciseness berarti ringkas tetapi tetap bermakna."
        },
        {
            type: "Hedging",
            question: "Hedging helps academic claims sound...",
            options: ["careful and objective", "angry", "too casual", "absolute without evidence"],
            answer: "careful and objective",
            explanation: "Hedging membuat klaim lebih hati-hati dan akademik."
        },
        {
            type: "Final",
            question: "Which sentence sounds most academic?",
            options: [
                "The findings suggest that the method may improve learning outcomes.",
                "This method is totally awesome and fixes everything.",
                "The thing is really good for students.",
                "Everyone must agree this is perfect."
            ],
            answer: "The findings suggest that the method may improve learning outcomes.",
            explanation: "Kalimat ini formal, objektif, dan memakai hedging."
        }
    ]
},

"cohesion-coherence": {
    title: "Cohesion vs Coherence",
    description: "Cohesion dan Coherence adalah dua konsep utama dalam penulisan yang baik. Cohesion berfokus pada bagaimana kalimat saling terhubung, sedangkan coherence berfokus pada bagaimana ide berkembang secara logis sehingga mudah dipahami pembaca.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Cohesion = Sentence Connection<br>
        Coherence = Logical Flow of Ideas
    `,

    notes: [
        "Cohesion menghubungkan kalimat menggunakan transition signals, pronouns, dan repeated keywords.",
        "Coherence memastikan setiap ide berkembang secara logis.",
        "Tulisan yang cohesive belum tentu coherent.",
        "Tulisan yang coherent membuat pembaca mudah mengikuti alur berpikir penulis.",
        "Academic writing membutuhkan cohesion dan coherence secara bersamaan.",
        "Setiap paragraf sebaiknya hanya memiliki satu ide utama."
    ],

    patterns: [
        {
            group: "Cohesion",
            items: [
                {
                    label: "Connecting Sentences",
                    formula: "Sentence + Connector + Sentence",
                    examples: [
                        "The experiment failed. Therefore, it was repeated.",
                        "The sample size was small. However, the results were reliable.",
                        "The method is simple. Moreover, it is inexpensive."
                    ]
                }
            ]
        },
        {
            group: "Coherence",
            items: [
                {
                    label: "Logical Development",
                    formula: "Topic → Explanation → Evidence → Conclusion",
                    examples: [
                        "Introduce the problem.",
                        "Explain the cause.",
                        "Present evidence.",
                        "Draw a conclusion."
                    ]
                }
            ]
        },
        {
            group: "Poor vs Good Organization",
            items: [
                {
                    label: "Paragraph Flow",
                    formula: "random ideas → organized ideas",
                    examples: [
                        "Poor: The weather is hot. I like pizza. Education is important.",
                        "Good: Education is important because it improves knowledge. Furthermore, it increases employment opportunities."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Cohesion mainly refers to...",
            options: [
                "how sentences are connected",
                "grammar only",
                "vocabulary size",
                "paragraph length"
            ],
            answer: "how sentences are connected",
            explanation: "Cohesion adalah hubungan antar kalimat."
        },
        {
            type: "Concept",
            question: "Coherence mainly refers to...",
            options: [
                "logical flow of ideas",
                "spelling accuracy",
                "pronunciation",
                "word order only"
            ],
            answer: "logical flow of ideas",
            explanation: "Coherence berkaitan dengan alur logis antar ide."
        },
        {
            type: "Cohesion",
            question: "Which word improves cohesion by showing contrast?",
            options: [
                "However",
                "Therefore",
                "Furthermore",
                "For example"
            ],
            answer: "However",
            explanation: "However menghubungkan dua ide yang bertentangan."
        },
        {
            type: "Cohesion",
            question: "Which word improves cohesion by showing addition?",
            options: [
                "Furthermore",
                "However",
                "Although",
                "Instead"
            ],
            answer: "Furthermore",
            explanation: "Furthermore digunakan untuk menambahkan informasi."
        },
        {
            type: "Coherence",
            question: "Which paragraph is coherent?",
            options: [
                "The study explains the problem, presents evidence, and concludes with recommendations.",
                "The study discusses education. I like coffee. The weather is sunny.",
                "Technology is useful. Cats sleep a lot. Research is important.",
                "The data is complete. My favorite movie is interesting."
            ],
            answer: "The study explains the problem, presents evidence, and concludes with recommendations.",
            explanation: "Semua kalimat membahas satu topik secara logis."
        },
        {
            type: "Organization",
            question: "A coherent paragraph should usually have...",
            options: [
                "one main idea",
                "many unrelated topics",
                "random examples",
                "no conclusion"
            ],
            answer: "one main idea",
            explanation: "Satu paragraf idealnya memiliki satu ide utama."
        },
        {
            type: "Academic Writing",
            question: "Which structure is most coherent?",
            options: [
                "Topic → Explanation → Evidence → Conclusion",
                "Evidence → Weather → Story → Topic",
                "Random Facts → Joke → Topic",
                "Conclusion → Movie → Evidence"
            ],
            answer: "Topic → Explanation → Evidence → Conclusion",
            explanation: "Ini adalah struktur umum paragraf akademik."
        },
        {
            type: "Sentence Link",
            question: "Which sentence pair has better cohesion?",
            options: [
                "The results were incomplete. Therefore, another experiment was conducted.",
                "The results were incomplete. My friend likes football.",
                "The results were incomplete. The weather was sunny.",
                "The results were incomplete. Pizza is delicious."
            ],
            answer: "The results were incomplete. Therefore, another experiment was conducted.",
            explanation: "Kalimat kedua berhubungan langsung dengan kalimat pertama."
        },
        {
            type: "Revision",
            question: "Which revision improves coherence?",
            options: [
                "Arrange ideas from introduction to conclusion.",
                "Add unrelated examples.",
                "Use random transitions.",
                "Change the topic every sentence."
            ],
            answer: "Arrange ideas from introduction to conclusion.",
            explanation: "Urutan ide yang logis meningkatkan coherence."
        },
        {
            type: "Final",
            question: "Which statement is correct?",
            options: [
                "Good academic writing requires both cohesion and coherence.",
                "Only grammar is important.",
                "Vocabulary alone creates coherence.",
                "Paragraphs should discuss many unrelated topics."
            ],
            answer: "Good academic writing requires both cohesion and coherence.",
            explanation: "Keduanya diperlukan agar tulisan mudah dipahami dan mengalir secara logis."
        }
    ]
},

"transition-signals": {
    title: "Transition Signals",
    description: "Transition Signals adalah kata atau frasa yang menghubungkan ide, kalimat, dan paragraf agar tulisan mengalir secara logis. Penggunaan transition signals yang tepat meningkatkan cohesion dan memudahkan pembaca mengikuti alur pembahasan.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Idea + Transition Signal + Idea
    `,

    notes: [
        "Transition signals menghubungkan hubungan antar ide.",
        "Gunakan transition sesuai hubungan logis yang ingin ditunjukkan.",
        "Jangan menggunakan transition secara berlebihan.",
        "Academic writing sangat bergantung pada transition signals.",
        "Transition dapat berada di awal, tengah, atau akhir kalimat tergantung strukturnya.",
        "Pilih transition yang sesuai dengan konteks, bukan hanya yang terdengar formal."
    ],

    patterns: [
        {
            group: "Addition",
            items: [
                {
                    label: "Adding Information",
                    formula: "Idea + addition",
                    examples: [
                        "Furthermore, the method is inexpensive.",
                        "Moreover, the findings support previous studies.",
                        "In addition, students received extra training."
                    ]
                }
            ]
        },
        {
            group: "Contrast",
            items: [
                {
                    label: "Showing Difference",
                    formula: "Idea + contrast",
                    examples: [
                        "However, the sample size was small.",
                        "Nevertheless, the results remained reliable.",
                        "On the other hand, another approach was considered."
                    ]
                }
            ]
        },
        {
            group: "Cause & Effect",
            items: [
                {
                    label: "Showing Result",
                    formula: "Cause → Effect",
                    examples: [
                        "Therefore, further research is needed.",
                        "As a result, productivity increased.",
                        "Consequently, the policy was revised."
                    ]
                }
            ]
        },
        {
            group: "Example",
            items: [
                {
                    label: "Giving Examples",
                    formula: "Statement → Example",
                    examples: [
                        "For example, online learning offers flexibility.",
                        "For instance, smartphones are widely used in education.",
                        "Such as renewable energy sources."
                    ]
                }
            ]
        },
        {
            group: "Sequence",
            items: [
                {
                    label: "Ordering Ideas",
                    formula: "Step 1 → Step 2 → Step 3",
                    examples: [
                        "First, collect the data.",
                        "Next, analyze the results.",
                        "Finally, draw a conclusion."
                    ]
                }
            ]
        },
        {
            group: "Conclusion",
            items: [
                {
                    label: "Ending Ideas",
                    formula: "Summary",
                    examples: [
                        "In conclusion, the hypothesis was supported.",
                        "Overall, the results were encouraging.",
                        "To summarize, regular practice improves performance."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Addition",
            question: "Which transition signal shows addition?",
            options: [
                "Furthermore",
                "However",
                "Therefore",
                "Although"
            ],
            answer: "Furthermore",
            explanation: "Furthermore digunakan untuk menambahkan informasi."
        },
        {
            type: "Contrast",
            question: "Which transition signal shows contrast?",
            options: [
                "However",
                "Moreover",
                "Therefore",
                "Finally"
            ],
            answer: "However",
            explanation: "However menunjukkan pertentangan antara dua ide."
        },
        {
            type: "Cause & Effect",
            question: "Which transition signal introduces a result?",
            options: [
                "Therefore",
                "For example",
                "Meanwhile",
                "Likewise"
            ],
            answer: "Therefore",
            explanation: "Therefore menunjukkan hasil atau akibat."
        },
        {
            type: "Example",
            question: "Which transition signal introduces an example?",
            options: [
                "For example",
                "Nevertheless",
                "Consequently",
                "Overall"
            ],
            answer: "For example",
            explanation: "For example digunakan untuk memberikan contoh."
        },
        {
            type: "Sequence",
            question: "Which transition signal is commonly used to begin a sequence?",
            options: [
                "First",
                "However",
                "Instead",
                "Although"
            ],
            answer: "First",
            explanation: "First digunakan untuk memulai urutan langkah."
        },
        {
            type: "Sequence",
            question: "Which transition signal is commonly used to end a sequence?",
            options: [
                "Finally",
                "Furthermore",
                "However",
                "Instead"
            ],
            answer: "Finally",
            explanation: "Finally digunakan untuk langkah terakhir."
        },
        {
            type: "Conclusion",
            question: "Which transition signal introduces a conclusion?",
            options: [
                "In conclusion",
                "For instance",
                "Meanwhile",
                "Similarly"
            ],
            answer: "In conclusion",
            explanation: "In conclusion digunakan untuk mengakhiri pembahasan."
        },
        {
            type: "Usage",
            question: "The experiment failed. ___, a different method was tested.",
            options: [
                "Therefore",
                "For example",
                "Likewise",
                "First"
            ],
            answer: "Therefore",
            explanation: "Therefore menunjukkan akibat dari kegagalan eksperimen."
        },
        {
            type: "Usage",
            question: "The first method was effective. ___, it required less time.",
            options: [
                "Moreover",
                "However",
                "Instead",
                "Finally"
            ],
            answer: "Moreover",
            explanation: "Moreover menambahkan informasi pendukung."
        },
        {
            type: "Final",
            question: "Why are transition signals important in academic writing?",
            options: [
                "They improve cohesion and make ideas easier to follow.",
                "They replace grammar rules.",
                "They make every sentence longer.",
                "They eliminate the need for paragraphs."
            ],
            answer: "They improve cohesion and make ideas easier to follow.",
            explanation: "Transition signals membantu menghubungkan ide sehingga tulisan mengalir dengan baik."
        }
    ]
},

"conciseness": {
    title: "Conciseness",
    description: "Conciseness adalah kemampuan menyampaikan informasi secara singkat, jelas, dan langsung tanpa menghilangkan makna penting. Tulisan yang ringkas lebih mudah dipahami dan merupakan salah satu ciri utama academic writing yang baik.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Clear + Direct + Necessary Information Only
    `,

    notes: [
        "Hapus kata atau frasa yang tidak diperlukan.",
        "Gunakan kata yang tepat daripada kalimat yang bertele-tele.",
        "Hindari pengulangan informasi yang sama.",
        "Gunakan active voice jika memungkinkan agar kalimat lebih ringkas.",
        "Setiap kata dalam kalimat sebaiknya memiliki fungsi yang jelas.",
        "Conciseness bukan berarti membuat kalimat terlalu pendek, tetapi menghilangkan bagian yang tidak perlu."
    ],

    patterns: [
        {
            group: "Remove Wordiness",
            items: [
                {
                    label: "Wordy → Concise",
                    formula: "long expression → concise expression",
                    examples: [
                        "due to the fact that → because",
                        "at this point in time → now",
                        "in order to → to"
                    ]
                }
            ]
        },
        {
            group: "Avoid Redundancy",
            items: [
                {
                    label: "Repeated Meaning",
                    formula: "redundant → concise",
                    examples: [
                        "each and every → each",
                        "basic fundamentals → fundamentals",
                        "future plans → plans"
                    ]
                }
            ]
        },
        {
            group: "Active Voice",
            items: [
                {
                    label: "More Direct",
                    formula: "passive → active",
                    examples: [
                        "The report was written by Sarah. → Sarah wrote the report.",
                        "The experiment was conducted by the researchers. → The researchers conducted the experiment.",
                        "The decision was made by the committee. → The committee made the decision."
                    ]
                }
            ]
        },
        {
            group: "Sentence Revision",
            items: [
                {
                    label: "Shorter but Clear",
                    formula: "wordy sentence → concise sentence",
                    examples: [
                        "There are many students who study online. → Many students study online.",
                        "It is important to note that... → Notably,...",
                        "The reason is because... → The reason is that..."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Conciseness means...",
            options: [
                "expressing ideas clearly with unnecessary words removed",
                "writing the longest possible sentences",
                "using difficult vocabulary only",
                "avoiding punctuation"
            ],
            answer: "expressing ideas clearly with unnecessary words removed",
            explanation: "Conciseness berarti menyampaikan ide secara jelas dan ringkas."
        },
        {
            type: "Wordiness",
            question: "Which phrase is more concise?",
            options: [
                "because",
                "due to the fact that",
                "owing to the fact that",
                "as a consequence of the fact that"
            ],
            answer: "because",
            explanation: "Because lebih singkat dengan makna yang sama."
        },
        {
            type: "Wordiness",
            question: "Which phrase is more concise?",
            options: [
                "to",
                "in order to",
                "for the purpose of",
                "with the intention of"
            ],
            answer: "to",
            explanation: "To biasanya cukup tanpa mengubah makna."
        },
        {
            type: "Redundancy",
            question: "Which expression is NOT redundant?",
            options: [
                "fundamentals",
                "basic fundamentals",
                "past history",
                "future plans"
            ],
            answer: "fundamentals",
            explanation: "Fundamentals sudah mengandung makna 'basic'."
        },
        {
            type: "Active Voice",
            question: "Which sentence is more concise?",
            options: [
                "Sarah wrote the report.",
                "The report was written by Sarah.",
                "The report had been written by Sarah.",
                "It was the report that Sarah wrote."
            ],
            answer: "Sarah wrote the report.",
            explanation: "Active voice biasanya lebih ringkas."
        },
        {
            type: "Revision",
            question: "Which sentence is more concise?",
            options: [
                "Many students study online.",
                "There are many students who study online.",
                "It can be seen that many students study online.",
                "There happen to be many students who study online."
            ],
            answer: "Many students study online.",
            explanation: "Kalimat langsung ke inti informasi."
        },
        {
            type: "Revision",
            question: "Choose the most concise replacement for 'at this point in time'.",
            options: [
                "now",
                "currently at this point in time",
                "during this point in time",
                "at this particular moment in time"
            ],
            answer: "now",
            explanation: "Now menyampaikan makna yang sama dengan lebih ringkas."
        },
        {
            type: "Academic Writing",
            question: "Why is conciseness important in academic writing?",
            options: [
                "It improves clarity and readability.",
                "It makes every sentence shorter regardless of meaning.",
                "It replaces grammar rules.",
                "It removes supporting evidence."
            ],
            answer: "It improves clarity and readability.",
            explanation: "Tulisan yang ringkas lebih mudah dipahami tanpa kehilangan informasi penting."
        },
        {
            type: "Editing",
            question: "Which sentence is the best revision?",
            options: [
                "The committee approved the proposal.",
                "The proposal was approved by the committee.",
                "It was the proposal that was approved by the committee.",
                "The proposal received approval from the committee."
            ],
            answer: "The committee approved the proposal.",
            explanation: "Versi active voice lebih langsung dan ringkas."
        },
        {
            type: "Final",
            question: "Which sentence demonstrates good conciseness?",
            options: [
                "The researchers analyzed the data and reported the results.",
                "The researchers were able to analyze the data in order to report the results.",
                "The researchers conducted an analysis of the data for the purpose of reporting the results.",
                "It is important to note that the researchers analyzed the data and then proceeded to report the results."
            ],
            answer: "The researchers analyzed the data and reported the results.",
            explanation: "Kalimat pertama menyampaikan informasi secara jelas tanpa kata-kata yang tidak diperlukan."
        }
    ]
},

"hedging-academic-tone": {
    title: "Hedging & Academic Tone",
    description: "Hedging adalah penggunaan kata atau frasa yang membuat suatu pernyataan terdengar lebih hati-hati dan objektif. Dalam academic writing, penulis jarang membuat klaim yang mutlak tanpa bukti. Hedging membantu menunjukkan bahwa suatu kesimpulan didasarkan pada data dan masih terbuka terhadap interpretasi lain.",

    formula: `
        <strong>Inti Materi:</strong><br>
        Strong Claim → Hedged Claim
    `,

    notes: [
        "Academic writing menghindari klaim yang terlalu mutlak.",
        "Gunakan modal verbs seperti may, might, could untuk menunjukkan kemungkinan.",
        "Gunakan verbs seperti suggest, indicate, appear, seem daripada prove jika bukti belum mutlak.",
        "Gunakan adverbs seperti probably, generally, likely, possibly bila sesuai konteks.",
        "Hedging meningkatkan objektivitas dan kredibilitas tulisan.",
        "Gunakan hedging hanya jika memang diperlukan; jangan membuat tulisan menjadi terlalu ragu-ragu."
    ],

    patterns: [
        {
            group: "Modal Verbs",
            items: [
                {
                    label: "Expressing Possibility",
                    formula: "modal verb + base verb",
                    examples: [
                        "The treatment may improve recovery.",
                        "The findings might explain the difference.",
                        "This method could reduce costs."
                    ]
                }
            ]
        },
        {
            group: "Academic Verbs",
            items: [
                {
                    label: "Less Absolute Verbs",
                    formula: "hedging verb",
                    examples: [
                        "The findings suggest that...",
                        "The results indicate that...",
                        "The evidence appears to support..."
                    ]
                }
            ]
        },
        {
            group: "Academic Adverbs",
            items: [
                {
                    label: "Softening Statements",
                    formula: "adverb + statement",
                    examples: [
                        "The policy will probably improve efficiency.",
                        "This is likely to occur.",
                        "The effect is generally consistent."
                    ]
                }
            ]
        },
        {
            group: "Strong vs Hedged Claims",
            items: [
                {
                    label: "Revision",
                    formula: "absolute → academic",
                    examples: [
                        "This method proves the theory. → This method suggests support for the theory.",
                        "This treatment always works. → This treatment appears to be effective.",
                        "The policy will solve the problem. → The policy may help address the problem."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Hedging is mainly used to...",
            options: [
                "make claims more cautious and objective",
                "make writing emotional",
                "avoid grammar",
                "make every sentence passive"
            ],
            answer: "make claims more cautious and objective",
            explanation: "Hedging membuat klaim terdengar lebih hati-hati dan sesuai dengan bukti yang tersedia."
        },
        {
            type: "Modal Verb",
            question: "Which modal verb expresses possibility?",
            options: [
                "may",
                "must",
                "will",
                "shall"
            ],
            answer: "may",
            explanation: "May menunjukkan kemungkinan, bukan kepastian."
        },
        {
            type: "Modal Verb",
            question: "Which sentence is better for academic writing?",
            options: [
                "The treatment may improve patient outcomes.",
                "The treatment always improves patient outcomes.",
                "The treatment definitely fixes every problem.",
                "The treatment never fails."
            ],
            answer: "The treatment may improve patient outcomes.",
            explanation: "Kalimat menggunakan hedging yang sesuai untuk klaim ilmiah."
        },
        {
            type: "Academic Verb",
            question: "Which verb is commonly used for hedging?",
            options: [
                "suggest",
                "prove",
                "guarantee",
                "confirm absolutely"
            ],
            answer: "suggest",
            explanation: "Suggest adalah salah satu hedging verb yang paling umum."
        },
        {
            type: "Academic Verb",
            question: "Which sentence sounds more academic?",
            options: [
                "The findings indicate a positive relationship.",
                "The findings prove everything.",
                "The findings completely settle the issue.",
                "The findings make the debate impossible."
            ],
            answer: "The findings indicate a positive relationship.",
            explanation: "Indicate lebih objektif daripada prove."
        },
        {
            type: "Adverb",
            question: "Which adverb is commonly used for hedging?",
            options: [
                "probably",
                "definitely",
                "absolutely",
                "certainly"
            ],
            answer: "probably",
            explanation: "Probably menyatakan kemungkinan, bukan kepastian."
        },
        {
            type: "Academic Tone",
            question: "Which sentence has a better academic tone?",
            options: [
                "The evidence appears to support the hypothesis.",
                "The evidence proves everything.",
                "The evidence is obviously correct.",
                "The evidence cannot possibly be wrong."
            ],
            answer: "The evidence appears to support the hypothesis.",
            explanation: "Appears to support menunjukkan sikap ilmiah yang hati-hati."
        },
        {
            type: "Revision",
            question: "Which revision is more appropriate?",
            options: [
                "The policy may reduce unemployment.",
                "The policy will eliminate unemployment forever.",
                "The policy definitely solves unemployment.",
                "The policy guarantees success."
            ],
            answer: "The policy may reduce unemployment.",
            explanation: "May reduce adalah klaim yang lebih realistis dan akademik."
        },
        {
            type: "Revision",
            question: "Which sentence demonstrates proper hedging?",
            options: [
                "The results suggest that further research is needed.",
                "The results completely answer every question.",
                "The results absolutely prove the theory.",
                "The results leave no possible doubt."
            ],
            answer: "The results suggest that further research is needed.",
            explanation: "Suggest dan further research adalah ciri khas academic writing."
        },
        {
            type: "Final",
            question: "Why is hedging important in academic writing?",
            options: [
                "It reflects evidence-based and objective reasoning.",
                "It makes writing sound uncertain all the time.",
                "It replaces supporting evidence.",
                "It avoids giving conclusions."
            ],
            answer: "It reflects evidence-based and objective reasoning.",
            explanation: "Hedging menunjukkan bahwa kesimpulan didasarkan pada bukti dan tidak mengklaim kepastian tanpa dasar."
        }
    ]
},

"writing-style-review": {
    title: "Writing Style Review",
    description: "Review akhir untuk menguji seluruh materi Writing Style & Cohesion, termasuk writing style, cohesion vs coherence, transition signals, conciseness, serta hedging dan academic tone.",

    formula: `
        <strong>Ringkasan BAB 21:</strong><br>
        Good Writing = Clear + Cohesive + Coherent + Concise + Objective
    `,

    notes: [
        "Writing yang baik mudah dipahami pembaca.",
        "Gunakan cohesion agar kalimat saling terhubung.",
        "Gunakan coherence agar ide berkembang secara logis.",
        "Gunakan transition signals sesuai hubungan antar ide.",
        "Hindari kalimat yang bertele-tele.",
        "Gunakan hedging untuk membuat klaim akademik lebih objektif."
    ],

    patterns: [
        {
            group: "Writing Principles",
            items: [
                {
                    label: "Complete Review",
                    formula: "Clear → Cohesive → Coherent → Concise → Objective",
                    examples: [
                        "Use clear sentence structure.",
                        "Connect ideas with transitions.",
                        "Develop one main idea per paragraph.",
                        "Avoid unnecessary words.",
                        "Support claims with evidence and appropriate hedging."
                    ]
                }
            ]
        }
    ],

    quiz: [
        {
            type: "Concept",
            question: "Good academic writing should be...",
            options: [
                "clear, logical, and objective",
                "long and complicated",
                "informal and emotional",
                "full of slang"
            ],
            answer: "clear, logical, and objective",
            explanation: "Academic writing harus jelas, logis, dan objektif."
        },
        {
            type: "Cohesion",
            question: "Cohesion refers to...",
            options: [
                "how sentences are connected",
                "grammar only",
                "spelling accuracy",
                "vocabulary size"
            ],
            answer: "how sentences are connected",
            explanation: "Cohesion adalah hubungan antar kalimat."
        },
        {
            type: "Coherence",
            question: "Coherence refers to...",
            options: [
                "the logical flow of ideas",
                "pronunciation",
                "punctuation",
                "sentence length"
            ],
            answer: "the logical flow of ideas",
            explanation: "Coherence berkaitan dengan perkembangan ide yang logis."
        },
        {
            type: "Transition",
            question: "Which transition signal shows contrast?",
            options: [
                "However",
                "Furthermore",
                "Therefore",
                "For example"
            ],
            answer: "However",
            explanation: "However digunakan untuk menunjukkan pertentangan."
        },
        {
            type: "Transition",
            question: "Which transition signal introduces a result?",
            options: [
                "Therefore",
                "Meanwhile",
                "Similarly",
                "For instance"
            ],
            answer: "Therefore",
            explanation: "Therefore menunjukkan akibat atau hasil."
        },
        {
            type: "Conciseness",
            question: "Which sentence is more concise?",
            options: [
                "Many students study online.",
                "There are many students who study online.",
                "It can clearly be seen that many students study online.",
                "There happen to be many students studying online nowadays."
            ],
            answer: "Many students study online.",
            explanation: "Kalimat pertama menyampaikan informasi secara langsung."
        },
        {
            type: "Conciseness",
            question: "Which phrase is the most concise?",
            options: [
                "because",
                "due to the fact that",
                "owing to the fact that",
                "as a consequence of the fact that"
            ],
            answer: "because",
            explanation: "Because menyampaikan makna yang sama dengan lebih ringkas."
        },
        {
            type: "Academic Tone",
            question: "Which sentence uses appropriate hedging?",
            options: [
                "The findings suggest that the treatment may improve outcomes.",
                "The findings prove that the treatment always works.",
                "The findings guarantee success.",
                "The findings completely settle the debate."
            ],
            answer: "The findings suggest that the treatment may improve outcomes.",
            explanation: "Suggest dan may menunjukkan hedging yang sesuai."
        },
        {
            type: "Academic Tone",
            question: "Which verb is most suitable for academic writing?",
            options: [
                "indicate",
                "prove absolutely",
                "guarantee",
                "confirm everything"
            ],
            answer: "indicate",
            explanation: "Indicate lebih objektif daripada kata-kata yang bersifat absolut."
        },
        {
            type: "Organization",
            question: "A well-written paragraph should generally contain...",
            options: [
                "one main idea with supporting details",
                "many unrelated topics",
                "random examples only",
                "multiple conclusions"
            ],
            answer: "one main idea with supporting details",
            explanation: "Satu paragraf idealnya mengembangkan satu ide utama."
        },
        {
            type: "Editing",
            question: "Which revision improves writing style?",
            options: [
                "The researchers analyzed the data and reported the findings.",
                "The researchers did the data and got some results.",
                "The researchers looked at stuff and said it was good.",
                "The researchers checked everything and it was awesome."
            ],
            answer: "The researchers analyzed the data and reported the findings.",
            explanation: "Kalimat pertama menggunakan kosakata formal dan presisi."
        },
        {
            type: "Editing",
            question: "Which sentence demonstrates both cohesion and coherence?",
            options: [
                "The experiment failed. Therefore, the researchers revised the method and repeated the test.",
                "The experiment failed. Pizza is delicious. Students study online.",
                "The experiment failed. My favorite sport is football.",
                "The experiment failed. The weather was sunny."
            ],
            answer: "The experiment failed. Therefore, the researchers revised the method and repeated the test.",
            explanation: "Kalimat kedua mengikuti akibat dari kalimat pertama sehingga kohesif dan koheren."
        },
        {
            type: "Revision",
            question: "Which sentence has the best academic tone?",
            options: [
                "The evidence appears to support the proposed hypothesis.",
                "The evidence proves everything beyond doubt.",
                "The evidence is obviously perfect.",
                "The evidence completely settles every question."
            ],
            answer: "The evidence appears to support the proposed hypothesis.",
            explanation: "Appears to support menunjukkan sikap ilmiah yang objektif."
        },
        {
            type: "Writing Quality",
            question: "Which characteristic is NOT part of good academic writing?",
            options: [
                "using unnecessary repetition",
                "logical organization",
                "clear language",
                "appropriate transitions"
            ],
            answer: "using unnecessary repetition",
            explanation: "Pengulangan yang tidak perlu justru mengurangi kualitas tulisan."
        },
        {
            type: "Final",
            question: "Which paragraph demonstrates the best writing style?",
            options: [
                "The study investigated the problem. Furthermore, the findings indicate a significant relationship. Therefore, additional research may improve current understanding.",
                "The study looked at stuff. It was really good. Everyone knows it is correct.",
                "The research was awesome. It totally proved everything forever.",
                "The study happened. Things happened. It was nice."
            ],
            answer: "The study investigated the problem. Furthermore, the findings indicate a significant relationship. Therefore, additional research may improve current understanding.",
            explanation: "Paragraf pertama memadukan cohesion, coherence, transition signals, conciseness, dan hedging dengan baik."
        }
    ]
}


};








export const MATERI_BAB_CONFIG = [
    {
        id: "bab1",
        icon: "fa-key",
        title: "BAB 1: Kunci Dasar & Jenis Kata",
        level: "Beginner",
        color: "#ef4444",
        items: [
                { label: "Parts of Speech", 
                    id: "pos",
                 video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/part-of-sentence.mp4",
                        title: "Parts of Speech"}
                },
                { label: "Noun", 
                    id: "noun", 
                video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/noun.mp4",
                        title: "Noun"}
                },
                { label: "Pronoun", 
                    id: "pronoun", 
                video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/pronoun.mp4",
                        title: "Pronoun"}
                },
                { label: "Verb", 
                    id: "verb",
                    video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/verb.mp4",
                        title: "Verb"} 
                },
                { label: "Adjective", 
                    id: "adjective", 
                video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/adjective.mp4",
                        title: "Adjective"}
                },
                { label: "Adverb", 
                    id: "adverb", 
                video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/adverb.mp4",
                        title: "Adverb"}
                },
                { label: "Preposition", 
                    id: "preposition", 
                video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/preposition.mp4",
                        title: "Preposition"}
                },
                { label: "Conjunction", 
                    id: "conjunction", 
                video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/conjunction.mp4",
                        title: "Conjunction"}
                },
                { label: "Interjection", 
                    id: "interjection", 
                video: {
                        type: "youtube",
                        url: "lat-inggris/assets/videos/interjection.mp4",
                        title: "Interjection"}
                }
                ]
    },

    {
    id: "bab2",
    icon: "fa-clock",
    title: "BAB 2: Kalimat Aktif",
    level: "Intermediate",
    color: "#f59e0b",
    items: [
        { label: "Present Tense", id: "present-tense" },
        { label: "Past Tense", id: "past-tense" },
        { label: "Future Tense", id: "future-tense" },
        { label: "Past Future Tense", id: "past-future-tense" }
    ]
},
    {
    id: "bab3",
    icon: "fa-code-branch",
    title: "BAB 3: Passive Voice",
    level: "Upper Intermediate",
    color: "#8b5cf6",
    items: [
        { label: "Present Passive", id: "present-passive" },
        { label: "Past Passive", id: "past-passive" },
        { label: "Future Passive", id: "future-passive" },
        { label: "Modal Passive", id: "modal-passive" }
    ]
},
    {
    id: "bab4",
    icon: "fa-graduation-cap",
    title: "BAB 4: Modal Verbs",
    level: "Advanced",
    color: "#22c55e",
    items: [
        { label: "Can & Could", id: "can-could" },
        { label: "May & Might", id: "may-might" },
        { label: "Should & Ought To", id: "should-ought-to" },
        { label: "Must & Have To", id: "must-have-to" },
        { label: "Will & Would", id: "will-would" },
        { label: "Modal Review", id: "modal-review" }
    ]
},

{
    id: "bab5",
    icon: "fa-person-running",
    title: "BAB 5: Gerund & Infinitive",
    level: "Advanced",
    color: "#06b6d4",
    items: [
        { label: "Gerund", id: "gerund" },
        { label: "Infinitive", id: "infinitive" },
        { label: "Gerund vs Infinitive", id: "gerund-vs-infinitive" },
        { label: "Verb + Gerund", id: "verb-gerund" },
        { label: "Verb + Infinitive", id: "verb-infinitive" },
        { label: "Verb + Gerund / Infinitive", id: "verb-both" },
        { label: "Gerund & Infinitive Review", id: "gerund-review" }
    ]
},

{
    id: "bab6",
    icon: "fa-book-open",
    title: "BAB 6: Articles & Determiners",
    level: "Upper Advanced",
    color: "#0ea5e9",
    items: [
        { label: "Articles", id: "articles" },
        { label: "A vs An", id: "a-vs-an" },
        { label: "The", id: "the-article" },
        { label: "Zero Article", id: "zero-article" },
        { label: "Determiners", id: "determiners" },
        { label: "Quantifiers", id: "quantifiers" },
        { label: "Articles Review", id: "articles-review" }
    ]
},

{
    id: "bab7",
    icon: "fa-code-branch",
    title: "BAB 7: Conditional Sentences",
    level: "Advanced",
    color: "#8b5cf6",
    items: [
        { label: "Introduction to Conditionals", id: "conditionals" },
        { label: "Zero Conditional", id: "zero-conditional" },
        { label: "First Conditional", id: "first-conditional" },
        { label: "Second Conditional", id: "second-conditional" },
        { label: "Third Conditional", id: "third-conditional" },
        { label: "Mixed Conditional", id: "mixed-conditional" },
        { label: "Conditional Review", id: "conditional-review" }
    ]
},

{
    id: "bab8",
    icon: "fa-comments",
    title: "BAB 8: Reported Speech",
    level: "Advanced",
    color: "#ec4899",
    items: [
        { label: "Introduction to Reported Speech", id: "reported-speech" },
        { label: "Reported Statements", id: "reported-statements" },
        { label: "Reported Questions", id: "reported-questions" },
        { label: "Reported Commands", id: "reported-commands" },
        { label: "Backshift", id: "backshift" },
        { label: "Reporting Verbs", id: "reporting-verbs" },
        { label: "Reported Speech Review", id: "reported-speech-review" }
    ]
},

{
    id: "bab9",
    icon: "fa-link",
    title: "BAB 9: Relative Clauses",
    level: "Advanced",
    color: "#14b8a6",
    items: [
        { label: "Introduction to Relative Clauses", id: "relative-clauses" },
        { label: "Who & Whom", id: "who-whom" },
        { label: "Which & That", id: "which-that" },
        { label: "Whose", id: "whose" },
        { label: "Where & When", id: "where-when" },
        { label: "Defining vs Non-Defining", id: "defining-nondefining" },
        { label: "Relative Clauses Review", id: "relative-clauses-review" }
    ]
},

{
    id: "bab10",
    icon: "fa-cubes",
    title: "BAB 10: Noun Clauses",
    level: "Expert",
    color: "#f97316",
    items: [
        { label: "Introduction to Noun Clauses", id: "noun-clauses" },
        { label: "That Clauses", id: "that-clauses" },
        { label: "WH Clauses", id: "wh-clauses" },
        { label: "Whether & If Clauses", id: "whether-if-clauses" },
        { label: "Noun Clauses as Subject", id: "noun-clause-subject" },
        { label: "Noun Clauses as Object", id: "noun-clause-object" },
        { label: "Noun Clauses Review", id: "noun-clauses-review" }
    ]
},

{
    id: "bab11",
    icon: "fa-layer-group",
    title: "BAB 11: Adverb Clauses",
    level: "Expert",
    color: "#6366f1",
    items: [
        { label: "Introduction to Adverb Clauses", id: "adverb-clauses" },
        { label: "Time Clauses", id: "time-clauses" },
        { label: "Reason Clauses", id: "reason-clauses" },
        { label: "Contrast Clauses", id: "contrast-clauses" },
        { label: "Purpose & Result Clauses", id: "purpose-result-clauses" },
        { label: "Condition Clauses", id: "condition-clauses" },
        { label: "Adverb Clauses Review", id: "adverb-clauses-review" }
    ]
}, 

{
    id: "bab12",
    icon: "fa-arrows-rotate",
    title: "BAB 12: Inversion",
    level: "Expert",
    color: "#dc2626",
    items: [
        { label: "Introduction to Inversion", id: "inversion" },
        { label: "Negative Adverbial Inversion", id: "negative-adverbial-inversion" },
        { label: "Only Inversion", id: "only-inversion" },
        { label: "So & Such Inversion", id: "so-such-inversion" },
        { label: "Conditional Inversion", id: "conditional-inversion" },
        { label: "Inversion Review", id: "inversion-review" }
    ]
},

{
    id: "bab13",
    icon: "fa-scale-balanced",
    title: "BAB 13: Subjunctive Mood",
    level: "Expert",
    color: "#7c3aed",
    items: [
        { label: "Introduction to Subjunctive", id: "subjunctive" },
        { label: "Mandative Subjunctive", id: "mandative-subjunctive" },
        { label: "Were Subjunctive", id: "were-subjunctive" },
        { label: "Wish & If Only", id: "wish-if-only" },
        { label: "It Is Important That", id: "important-that" },
        { label: "Subjunctive Review", id: "subjunctive-review" }
    ]
},

{
    id: "bab14",
    icon: "fa-pen-nib",
    title: "BAB 14: Punctuation & Capitalization",
    level: "Expert",
    color: "#0891b2",
    items: [
        { label: "Introduction to Punctuation", id: "punctuation" },
        { label: "Comma Rules", id: "comma-rules" },
        { label: "Period, Question Mark & Exclamation", id: "end-punctuation" },
        { label: "Colon & Semicolon", id: "colon-semicolon" },
        { label: "Apostrophe & Quotation Marks", id: "apostrophe-quotation" },
        { label: "Capitalization Rules", id: "capitalization" },
        { label: "Punctuation Review", id: "punctuation-review" }
    ]
},

{
    id: "bab15",
    icon: "fa-triangle-exclamation",
    title: "BAB 15: Common Grammar Mistakes",
    level: "Expert",
    color: "#ea580c",
    items: [
        { label: "Introduction to Common Mistakes", id: "common-mistakes" },
        { label: "Subject-Verb Agreement Errors", id: "sva-errors" },
        { label: "Tense Consistency Errors", id: "tense-consistency-errors" },
        { label: "Word Form Errors", id: "word-form-errors" },
        { label: "Preposition Errors", id: "preposition-errors" },
        { label: "Sentence Structure Errors", id: "sentence-structure-errors" },
        { label: "Common Mistakes Review", id: "common-mistakes-review" }
    ]
},

{
    id: "bab16",
    icon: "fa-diagram-project",
    title: "BAB 16: Advanced Sentence Patterns",
    level: "Master",
    color: "#7c2d12",
    items: [
        { label: "Introduction to Advanced Sentences", id: "advanced-sentences" },
        { label: "Emphasis (Cleft Sentences)", id: "cleft-sentences" },
        { label: "Parallel Structure", id: "parallel-structure" },
        { label: "Ellipsis", id: "ellipsis" },
        { label: "Fronting & Topicalization", id: "fronting" },
        { label: "Discourse Markers", id: "discourse-markers" },
        { label: "Advanced Sentence Review", id: "advanced-review" }
    ]
},

{
    id: "bab17",
    icon: "fa-puzzle-piece",
    title: "BAB 17: Phrasal Verbs",
    level: "Master",
    color: "#16a34a",
    items: [
        { label: "Introduction to Phrasal Verbs", id: "phrasal-verbs" },
        { label: "Separable Phrasal Verbs", id: "separable-phrasal-verbs" },
        { label: "Inseparable Phrasal Verbs", id: "inseparable-phrasal-verbs" },
        { label: "Common Daily Phrasal Verbs", id: "daily-phrasal-verbs" },
        { label: "Academic & Formal Alternatives", id: "formal-phrasal-verbs" },
        { label: "Phrasal Verbs Review", id: "phrasal-verbs-review" }
    ]
},

{
    id: "bab18",
    icon: "fa-comments",
    title: "BAB 18: Idioms",
    level: "Master",
    color: "#9333ea",
    items: [
        { label: "Introduction to Idioms", id: "idioms" },
        { label: "Common Daily Idioms", id: "daily-idioms" },
        { label: "Business & Academic Idioms", id: "academic-idioms" },
        { label: "Body Idioms", id: "body-idioms" },
        { label: "Animal Idioms", id: "animal-idioms" },
        { label: "Idioms Review", id: "idioms-review" }
    ]
},

{
    id: "bab19",
    icon: "fa-link",
    title: "BAB 19: Collocations",
    level: "Master",
    color: "#0f766e",
    items: [
        { label: "Introduction to Collocations", id: "collocations" },
        { label: "Verb + Noun Collocations", id: "verb-noun-collocations" },
        { label: "Adjective + Noun Collocations", id: "adjective-noun-collocations" },
        { label: "Adverb + Adjective Collocations", id: "adverb-adjective-collocations" },
        { label: "Business & Academic Collocations", id: "business-academic-collocations" },
        { label: "Collocations Review", id: "collocations-review" }
    ]
},

{
    id: "bab20",
    icon: "fa-book-open",
    title: "BAB 20: Academic Vocabulary & Word Choice",
    level: "Master",
    color: "#2563eb",
    items: [
        { label: "Introduction to Academic Vocabulary", id: "academic-vocabulary" },
        { label: "Formal vs Informal Words", id: "formal-informal-words" },
        { label: "Word Precision", id: "word-precision" },
        { label: "Avoiding Repetition", id: "avoiding-repetition" },
        { label: "Academic Word List (AWL)", id: "academic-word-list" },
        { label: "Academic Vocabulary Review", id: "academic-vocabulary-review" }
    ]
},

{
    id: "bab21",
    icon: "fa-feather-pointed",
    title: "BAB 21: Writing Style & Cohesion",
    level: "Master",
    color: "#be123c",
    items: [
        { label: "Introduction to Writing Style", id: "writing-style" },
        { label: "Cohesion vs Coherence", id: "cohesion-coherence" },
        { label: "Transition Signals", id: "transition-signals" },
        { label: "Conciseness", id: "conciseness" },
        { label: "Hedging & Academic Tone", id: "hedging-academic-tone" },
        { label: "Writing Style Review", id: "writing-style-review" }
    ]
}



];

window.MATERI_CONTENT = MATERI_CONTENT;
window.MATERI_BAB_CONFIG = MATERI_BAB_CONFIG;

console.log("CONFIG LOADED", {
    bab1Total: MATERI_BAB_CONFIG[0].items.length,
    bab1Items: MATERI_BAB_CONFIG[0].items.map(i => i.label),
    bab2Total: MATERI_BAB_CONFIG[1].items.length,
    bab2Items: MATERI_BAB_CONFIG[1].items.map(i => i.label)
});