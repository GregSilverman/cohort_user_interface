/**
 * Global functions
 *
 */
Ext.define('cardioCatalogQT.service.UtilityService', {
    singleton : true,
    alias : 'widget.utility',
    constructor: function(config) {
        this.initConfig(config);
    },

    // Assemble URL payload for Ajax call to API
    // format is atom_part1;atom_part2
    // part1 maintains information for the bucket from which to pull (e.g., lab -> test_code bucket, sex -> demographics)
    // part2 maintains information about the specific bucket attribute/item and criterion by value to pull
    // (e.g, lab -> result_value with double_value = desired value, or demographics -> sex with string_value = m)
    //
    // Each part has three delimited sections (particles) in the format 'type:key;comparator;value', where
    // a) 'type' gives the reference to the type of data and 'key' identifies the bucket name or the bucket attribute name (in API: pulled from the attribute table by attribute_value),
    // b) 'comparator' is the comparison operator and (in API: operation to be performed)
    // c) 'value' is the criterion value (in API: pull attribute name by attribute_value and query by string or double value)
    //
    // Date comparisons are appended to the criterion value
    // They are denoted by the character string DATE
    //
    // Comparator operators are different than the standard
    // mappings to actual attribute names are resolved via a hash lookup
    // comparators for static defaults are set in code below (e.g., blood_pressure/lab)

    // We use the idiom of atomic structure:
    //
    // An atom is comprised of a string of the form atom_part1;atom_part2 -> type:keyA;comparatorA;valueA;type:keyB;comparatorB;valueB
    // where each ';' delimited unit is defined as an atomic particle,
    // thus an atom is made up of 6 particles

    make_atom: function(type, key, comparator, value, dateComparator, dateValue) {
        var
            atomic_unit, // = '' each specific item to be queried
            seperator = ':',
            delimiter = ';',
            parent = cardioCatalogQT.service.UtilityService.parent_hash(type);

        if (type === 'rx'){
            parent = key;
        }

        // section "a" of query
        atomic_unit = type +
            seperator +
            parent +
            delimiter;

        if (key === 'blood_pressure_systolic' ||
            key === 'blood_pressure_diastolic' ||
            key === 'bmi' ||
            key === 'respiratory_rate' ||
            key === 'pulse' ||
            key === 'body_temperature' ||
            key === 'height' ||
            key === 'weight' ||
            key === 'pulse_oxymetry' ||
            type === 'lab' ||
            type === 'sex' ||
            type === 'age' ||
            type === 'vital_status') {
            atomic_unit += 'eq';
        }
        else {
            atomic_unit += comparator;
        }

        atomic_unit += delimiter;

        // section "b"
        if (key === 'blood_pressure_systolic' ||
            key === 'blood_pressure_diastolic') {
            atomic_unit += 'blood_pressure';
        }
        // other vital measures
        else if (key === 'bmi' ||
                 key === 'respiratory_rate' ||
                 key === 'pulse' ||
                 key === 'body_temperature' ||
                 key === 'height' ||
                 key === 'weight' ||
                 key === 'pulse_oxymetry') {
            atomic_unit += 'basic_vitals';
        }
        else if (key === 'sex' ||
                 key === 'vital_status' ||
                 key === 'age'){
            atomic_unit += 'demographics';
        }
        else if (type === 'lab') {
            atomic_unit += key;
        }
        else {
            atomic_unit += value;
        }

        atomic_unit += delimiter +
            type +
            seperator;

        if (key === 'blood_pressure_systolic' ||
            key === 'blood_pressure_diastolic' ||
            key === 'sex' ||
            key === 'bmi' ||
            key === 'respiratory_rate' ||
            key === 'pulse' ||
            key === 'body_temperature' ||
            key === 'height' ||
            key === 'weight' ||
            key === 'pulse_oxymetry' ||
            key === 'vital_status' ||
            key === 'age') {
            atomic_unit += key;
        }
        else if (type === 'lab') {
            atomic_unit += 'result_value_num';
        }
        else {
            atomic_unit += parent;
        }

        // section "c"
        atomic_unit += delimiter +
            comparator +
            delimiter +
            value;

        // add date here
        if (dateValue){
            atomic_unit += ',DATE,' +
                cardioCatalogQT.service.UtilityService.date_hash(dateComparator) + ',' +
                dateValue;
        }

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('atomic_unit');
            console.log(atomic_unit);
        }

        return atomic_unit;
    },

    // Molecules are atoms concatenated by boolean AND or OR, or preceeded by NOT
    make_molecule: function(payload, options, button) {
        var target, // target store for boolean combined statements
            bool_delimiter,
            n = payload.getCount(),
            i = 0,
            j = 1,
            new_criteria = '',
            bool_operator,
            molecule = '', // combination of boolean expression and other terms
            key = ''; // grab keys for boolean combined criteria

        if (options.delimiter === '&'){
            bool_delimiter = options.delimiter;
            bool_operator = 'AND';
        }
        else if (options.delimiter === '|') {
            bool_delimiter = options.delimiter;
            bool_operator = 'OR'
        }
        else if (options.delimiter === '~') {
            bool_delimiter = options.delimiter;
            bool_operator = 'NOT'
            console.log('!!!!')
        }

        // set target store to appropriate source
        target = Ext.create('cardioCatalogQT.store.' + payload.storeId);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('count: ' + payload.getCount())
            console.log('Test payload:');
            console.log(payload);
            console.log('n: ' + n);
            console.log('storeId: ');
            console.log(payload.storeId);
            console.log('target:');
            console.log(target);
        }

        payload.each(function(rec) {

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('payload record');
                console.log(rec.data);
            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('criteria record:' + rec.data.criteria);
                console.log('atom record:' + rec.data.atom);
                console.log('j: ' + j);
            }

            molecule += rec.data.atom;
            new_criteria += rec.data.criteria;

            // create composite key
            if (i === 0) {
                key = payload.data.items[i].data.id;
            }
            else {
                key += ',' + payload.data.items[i].data.id;
            }

            i += 1;

            // add parentheses
            if (j>1) {
                molecule = '(' + molecule + ')';
            }

            // separate all query units by delimiter, except for the last
            if (i < n && options.delimiter !== '~') {
                molecule += bool_delimiter;
                new_criteria += ' ' +
                    bool_operator +
                    ' ';
            } // (A|~A)&~A = ~A
            else if (i === 1 && options.delimiter === '~'){
                molecule = '((' + molecule + '|' +
                    bool_delimiter +
                    molecule + ')'+ '&' +
                    bool_delimiter +
                    molecule + ')';

                new_criteria = ' ' +  bool_operator +  ' ' +
                    new_criteria;
            }

            j += 1

        });

        // insert boolean combination into store
        if (molecule && new_criteria) {

            new_criteria = '(' + new_criteria + ')';

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('new criteria: ' + new_criteria);
                console.log('new molecule: ' + molecule);
                console.log('key: '  + key);
                console.log('bool_op: ' + bool_operator);
            }

            var payload = {
                key: key,
                type: bool_operator,
                description: key,
                criteria: new_criteria,
                atom: molecule
            };

            var grid = button.up('grid'),
                // bind grid store as source
                source = grid.store,
                store = Ext.getStore(source);

            store.clearFilter();
            grid.getStore().load();

            cardioCatalogQT.service.UtilityService.url(button, molecule, 'NULL', payload);

        }

    },

    // used for display with query results
    criteria: function(payload, options, n){

        var criteria = '',
            comparator,
            date_comparator,
            bool,
            i = 0;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Service test:');
            console.log(payload);
        }

        if (!options.delimiter || options.delimiter === ';'){
            bool = 'AND';
        }
        else if (options.delimiter === '|'){
            bool = 'OR';
        }

        payload.each(function(rec) {

            // get symbol for display
            comparator = cardioCatalogQT.service.UtilityService.comparator_hash(rec.data.comparator);
            date_comparator = cardioCatalogQT.service.UtilityService.date_comparator_hash(rec.data.dateComparator);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('query comparator ');
                console.log(comparator);
                console.log('date comparator ');
                console.log(date_comparator);

            }

            criteria += rec.data.type.toUpperCase() + ' '
                            + ' ' + comparator + ' ' + ' '
                            + rec.data.value + ' ' +  ' '
                            + rec.data.description.toUpperCase();


            if (rec.data.dateValue){
                criteria += ' ' + 'in date range: ' + date_comparator + ' ' + ' '
                    + rec.data.dateValue
            }

            i += 1;

            // separate all query units by appropriate boolean operator
            if (i < n){
                criteria += bool;
            }

            criteria += '<br>';

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('query criteria: ' + criteria);
            }

        });

        return criteria;
    },

    // get parent element for pulling correct bucket
    parent_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('blood_pressure_systolic', 'blood_pressure');
        map.add('blood_pressure_diastolic', 'blood_pressure');
        map.add('bmi', 'basic_vitals');
        map.add('respiratory_rate', 'basic_vitals');
        map.add('pulse', 'basic_vitals');
        map.add('body_temperature', 'basic_vitals');
        map.add('height', 'basic_vitals');
        map.add('weight', 'basic_vitals');
        map.add('pulse_oxymetry', 'basic_vitals');
        map.add('vital_status', 'demographics');
        map.add('sex', 'demographics');
        map.add('age', 'demographics');
        map.add('dx', 'dx_code');
        map.add('lab', 'test_code');
        map.add('px', 'proc_code');
        /*map.add('rx_code', 'drug_code');
        map.add('rx_therapeutic_class', 'THERAPEUTIC_CLASS_ORIG');
        map.add('rx_pharmaceutical_class', 'PHARMACEUTICAL_CLASS_ORIG');
        map.add('rx_pharmaceutical_subclass', 'PHARMACEUTICAL_SUBCLASS_ORIG');*/

        //map.add('rx', 'drug_code');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    // used to shorten URL -> TODO: populate using an API endpoint
    attribute_hash: function(type) {

        //id	attribute_value
        //1	PATIENT_ID
        //2	PATIENT_SID
        //3	BIRTH_DATETIME
        var map = new Ext.util.HashMap();

        map.add('SEX', 4);
        map.add('ETHNICITY', 5);
        map.add('RACE', 6);
        map.add('VITAL_STATUS', 7);
        map.add('DEMOGRAPHICS', 8);
        map.add('AGE', 9);
        map.add('HEIGHT', 10);
        //11	HEIGHT_UNIT
        map.add('WEIGHT', 12);
        //13	WEIGHT_UNIT
        map.add('BODY_TEMPERATURE', 14);
        //15	BODY_TEMP_UNIT
        map.add('PULSE', 16);
        map.add('BLOOD_PRESSURE_DIASTOLIC', 17);
        map.add('BLOOD_PRESSURE_SYSTOLIC', 18);
        map.add('BMI', 19);
        map.add('PULSE_OXYMETRY', 20);
        map.add('RESPIRATORY_RATE', 21);
        //22	COLLECTION_DATETIME
        map.add('BASIC_VITALS', 23);
        map.add('BLOOD_PRESSURE', 24);
        map.add('DX_CODE', 25);
        //26	DX_NAME
        //27	DIAGNOSIS_DATETIME
        map.add('DIAGNOSES', 28);
        map.add('PROC_CODE', 29);
        //30	PROC_NAME
        //31	PROC_DATETIME
        map.add('PROCEDURES', 32);
        map.add('TEST_CODE', 33);
        //34	TEST_NAME
        //35	RESULT_VALUE
        map.add('RESULT_VALUE_NUM', 36);
        //37	RESULT_UNIT
        //38	RESULT_DATETIME
        map.add('LABS', 39);
        //40	DRUG_CODE_ORIG
        //41	DRUG_CODE_SYSTEM_ORIG
        map.add('DRUG_CODE', 42);
        //43	DRUG_CODE_SYSTEM
        //44	DRUG_NAME
        //45	BRAND_NAME
        //46	GENERIC_NAME
        //47	BRAND_GENERIC_NAME
        //48	START_DATETIME
        //49	END_DATETIME
        //50	ACTIVE_ORDER
        //51	INPATIENT_OR_OUTPATIENT
        //52	PATIENT_REPORTED_YN
        map.add('MEDICATIONS', 53);
        map.add('THERAPEUTIC_CLASS_ORIG', 54);
        map.add('PHARMACEUTICAL_CLASS_ORIG', 55);
        map.add('PHARMACEUTICAL_SUBCLASS_ORIG', 56);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('attribute');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    // get symbol for display
    comparator_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('eq', '=');
        map.add('lt', '<');
        map.add('lste', '<=');
        map.add('gt', '>');
        map.add('grte', '>=');
        map.add('bt', 'between');
        map.add('prn', 'all');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    // use for grid display
    date_comparator_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('le', 'before');
        map.add('ge', 'after');
        map.add('bt', 'between');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    // use for atomic payload construction
    date_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('le', 'lss');
        map.add('ge', 'grt');
        map.add('bt', 'between');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
            console.log(type);
            console.log(map.get(type));
        }

        return map.get(type);

    },

    template: function(panel, store) {
        var tpl,
            n = store.getCount();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('n: ' + n);
        }
        // bind store to form panel
        panel.setData(store);

        tpl = new Ext.XTemplate(
            '<table border=\'\1\'\ style=\'\width:25%\'\>',
                '<tr>',
                    '<td>sid</td>',
                '</tr>',
                '<tpl for=".">',
                    '<tr>',
                        '<td>{data.sid}</td>',
                    '</tr>',
                '</tpl>',
            '</table>'
        );
        // render template with store data to panel using HTML and remove mask from parent object

        panel.setHtml(n + ' patients met the given criteria:'
                            + '<br>'
                            //+ criteria
                            + '<br>'
                            + tpl.apply(store));

        return n;
    },

    criteria_template: function(panel, store) {
        var tpl;

        // bind store to form panel
        panel.setData(store);

        tpl = new Ext.XTemplate(
            '<table border=\'\1\'\ style=\'\width:25%\'\>',
                '<tr>',
                    '<td>CRITERIA</td>',
                '</tr>',
                '<tpl for=".">',
                    '<tr>',
                    // '<td>{data.sid}</td>',
                        '<tpl if="data.type === \'dx\' || data.type === \'px\' || data.type === \'rx\' ">',
                            '<td>{data.type} {data.comparatorSymbol} {data.description}</td>',
                        '<tpl elseif="data.type === \'lab\'">',
                            '<td> {data.description} {data.comparatorSymbol} {data.value}</td>',
                        '<tpl else>',
                            '<td>{data.type} {data.comparatorSymbol} {data.value}</td>',
                        '</tpl>',
                    '</tr>',
                '</tpl>',
            '</table>'
        );
        // render template with store data to panel using HTML and remove mask from parent object

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('submitted criteria:');
            console.log(store);
        }

        panel.setHtml(tpl.apply(store)); //TODO: add criteria on which query was executed
    },

    clear_all: function() {
        var Payload = Ext.getStore('Payload');

        Payload.getProxy().clear();
        Payload.data.clear();
        Payload.sync();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Cleared!');
        }
    },

    // customized search, as per http://stackoverflow.com/questions/28974034/multiselect-search-whole-string
    multi_select_search: function(text,me) {

        var filter = me.searchFilter,
            filters = me.getSearchStore().getFilters();

        if (text) {
            filters.beginUpdate();

            if (filter) {
                filter.setValue(text);
            } else {
                me.searchFilter = filter = new Ext.util.Filter({
                    id: 'search',
                    property: me.field,
                    value: text,
                    anyMatch: true
                });
            }

            filters.add(filter);

            filters.endUpdate();
        } else if (filter) {
            filters.remove(filter);
        }
    },

    assemble_boolean: function(button, options){
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            source, // source store to filter
            filtered = []; // source ids that are filtered

        // bind grid store as source
        source = grid.store;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('grid');
            console.log(grid);
            console.log('selection');
            console.log(selection);
            console.log('store');
            console.log(source);
            console.log('storeId');
            console.log(grid.store.storeId);
        }

        if (selection) {

            // array of elements on which to filter
            Ext.Array.each(selection, function (item) {
                filtered.push(item.data.id);
            });

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered');
                console.log(filtered);
            }

            source.clearFilter(true); // Clears old filters
            source.filter([ // filter on selected array elements
                {
                    filterFn: function(rec) {
                        return Ext.Array.indexOf(filtered, rec.get('id')) != -1;
                    }
                }
            ]);

            cardioCatalogQT.service.UtilityService.make_molecule(source, options, button);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('filtered store');
                console.log(source);
            }
        }
        else {
            if (cardioCatalogQT.config.mode === 'test') {
                console.log('nada')
            }
        }

    },

    query_move: function(button){
        var grid = button.up('grid'),
            selection = grid.getSelectionModel().getSelection(),
            source, // source store to filter
            filtered = [],
            url = cardioCatalogQT.config.protocol,
            test =  Ext.getStore('Queries'),
            obj, // object to pass to endpoint
            query = []; // source ids that are filtered

        // bind grid store as source
        source = grid.store;

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiWriteQ;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('grid');
            console.log(grid);
            console.log('selection');
            console.log(selection);
            console.log('store');
            console.log(source);
            console.log('storeId');
            console.log(grid.store.storeId);
        }

        // TODO: add comments
        Ext.Msg.prompt('Name', 'Please enter name to save query as:', function(btn, text) {
            if (btn == 'ok') {
                // process text value and close...

                //console.log('query name:');
                //console.log(text);

                if (selection) {

                    //console.log('A' + text);
                    // array of elements on which to filter
                    Ext.Array.each(selection, function (item) {
                        filtered.push(item.data.id);

                        obj = {
                            query: {
                                molecule: item.data.atom,
                                criteria: item.data.criteria,
                                query_name: text
                            }
                        };

                        if (cardioCatalogQT.config.mode === 'test') {
                            console.log('TEST');
                            console.log(item.data.atom);
                            console.log(item.data.criteria);
                            console.log('JSON');
                            console.log(obj);
                        }

                        var recordIndex = test.findBy(
                            function (record, id) {
                                if (record.get('molecule') === item.data.atom &&
                                    record.get('criteria') === item.data.criteria) {
                                    return true;  // a record with this data exists
                                }

                                return false;  // there is no record in the store with this data

                            }
                        );

                        // TODO: give option to add as update
                        if (recordIndex != -1) {
                            console.log("We have a duplicate, abort!");
                        }
                        else {

                            query.push(item.data.atom);
                            query.push(item.data.criteria);

                            Ext.Ajax.request({
                                cors: true,
                                useDefaultXhrHeader: false,
                                url: url,
                                jsonData: obj,
                                headers: {
                                    'Accept': 'application/json'
                                },
                                disableCaching: false,
                                success: function (response) {

                                    if (response.status === 200) {

                                        // TODO: test that this works
                                        test.load(function() {
                                            // reload grid
                                            Ext.ComponentQuery.query('#queryGrid')[0].getStore().load();
                                        });

                                    } else {
                                        if (cardioCatalogQT.config.mode === 'test') {
                                            console.log('bad http response');
                                        }
                                    }
                                },
                                failure: function (response) {
                                    //me.sessionToken = null;
                                    //me.signInFailure('Login failed. Please try again later.');
                                }
                            });
                        }

                    });

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('filtered');
                        console.log(filtered);
                        console.log('QUERY')
                        console.log(query)

                        console.log('updated store')
                        console.log(test)
                    }

                    source.clearFilter(true); // Clears old filters
                    source.filter([ // filter on selected array elements
                        {
                            filterFn: function (rec) {
                                return Ext.Array.indexOf(filtered, rec.get('id')) != -1;
                            }
                        }
                    ]);

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('filtered store');
                        console.log(source);
                    }
                }
                else {
                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('nada')
                    }
                }
            }

            var //source = grid.store,
                store = Ext.getStore(source);

            store.clearFilter();
            grid.getStore().load();
        });

    },

    url: function(button, atom, from, payload){

        var url = cardioCatalogQT.config.protocol,
            grid = button.up('grid'),
            //selection = grid.getSelectionModel().getSelection(),
            source,
            print_all = false;

        console.log('in url:')
        console.log(Ext.ComponentQuery.query('#searchGrid')[0].getStore());

        if (from == 'submitSaved') {
            source = Ext.ComponentQuery.query('#searchGrid')[0].getStore();
        }
        else {
            source = grid.store;
        }

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('from:');
            console.log(from);
            console.log('grid');
            console.log(grid);
            console.log('store');
            console.log(source);
            console.log('atom ' + atom);
        }

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiGetQ;
        // only needed for http GET request
        //url += atom;

        cardioCatalogQT.service.UtilityService.submit_query(url, source, atom, payload, print_all);

    },

    submit_query: function(url, source, atom, payload, print_all){

        var json = [],
            obj,
            records = [],
            //store = Ext.create('cardioCatalogQT.store.TestResults'),
            store = Ext.getStore('TestResults'),
            i,
            max;

        //store.getProxy().clear();
        //store.data.clear();
        //store.sync();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('call to make url: ' + url);
        }

        // show loadMask during request
        Ext.getBody().mask("Computing...");
        obj = {
            query: {
                payload: atom
            }
        };


        Ext.Ajax.request({
            cors: true,
            useDefaultXhrHeader: false,
            url: url,
            jsonData: obj,
            headers: {
                'Accept': 'application/json'
            },
            disableCaching: false,

            success: function(response) {
                json = Ext.decode(response.responseText);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('json' + json);
                }

                if (print_all) {
                    if (json !== null && typeof (json) !== 'undefined') {

                        for (i = 0, max = json.items.length; i < max; i += 1) {

                            records.push({
                                sid: json.items[i].sid,
                                attribute: json.items[i].attribute,
                                string: json.items[i].value_s,
                                number: json.items[i].value_d
                            });


                        }


                    }
                }

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(records);
                    console.log('store');
                    console.log(store);
                    console.log('N');
                    console.log(store.getCount());
                    console.log(store.collect('sid').length);
                    console.log(payload.atom);
                }

                // stop loadMask
                Ext.getBody().unmask();
                store.load(function() {
                    console.log('ON LOAD')
                    console.log(store.collect('sid').length);

                    // only add to grid if not showing results
                    if (!print_all) {
                        source.add({
                            key: payload.key,
                            type: payload.type,
                            description: payload.description,
                            criteria: payload.criteria,
                            atom: payload.atom,
                            n: store.collect('sid').length // get length of array for unique sids
                        });
                        source.sync();
                    }
                    // update grid store content
                    Ext.StoreMgr.get('Payload').load();
                    Ext.ComponentQuery.query('#searchGrid')[0].getStore().load();
                });


            }
        });
    }

});