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
            parent = cardioCatalogQT.service.UtilityService.get_attribute_id(type);

        // type:key;eq;
        atomic_unit = type +
            seperator;

        if (type === 'medications'){
            parent = cardioCatalogQT.service.UtilityService.get_attribute_id(key);
        }

        atomic_unit += parent +
            delimiter +
            'eq' +
            delimiter;

        // type1:key1;eq;value1
        if (type === 'basic_vitals' ||
            type === 'demographics') {
            atomic_unit += type;
        }
        else if (type === 'test_code') {
            atomic_unit += key;
        }
        else {
            atomic_unit += value;
        }

        // type:key1;eq;value1;type:
        atomic_unit += delimiter +
            type +
            seperator;

        if (type  === 'test_code'){
            key = 'result_value_num';
        }

        // type:key1;eq;value1;type:key2;comparator;value2
        atomic_unit += cardioCatalogQT.service.UtilityService.get_attribute_id(key) +
            delimiter +
            comparator +
            delimiter +
            value;

        // add date if exists -> type:key1;eq;value1;type:key2;comparator;value2,DATE,dateComparator,dateValue
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
            bool_operator = 'OR';
        }
        else if (options.delimiter === '~') {
            bool_delimiter = options.delimiter;
            bool_operator = 'NOT';
        }

        payload.each(function(rec) {

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

            payload = {
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

    // get symbol for display
    comparator_hash: function(type) {
        var map = new Ext.util.HashMap();

        map.add('eq', '=');
        map.add('lt', '<');
        map.add('lete', '<=');
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

    // use id for atomic payload construction
    get_attribute_id: function(arg) {
        var store = Ext.getStore('Attributes'),
            value;

        arg = arg.toUpperCase();

        value = store.findRecord('attribute_value', arg);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Attribute');
            console.log(value);
        }

        return value.id

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
            store,
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

                if (selection) {

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
                                return !!(record.get('molecule') === item.data.atom &&
                                record.get('criteria') === item.data.criteria);
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

                                    // error message here
                                }
                            });
                        }

                    });

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('filtered');
                        console.log(filtered);
                        console.log('QUERY');
                        console.log(query);

                        console.log('updated store')
                        console.log(test);
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

            store = Ext.getStore(source);
            store.clearFilter();
            grid.getStore().load();
        });
    },

    url: function(button, atom, from, payload){
        var url = cardioCatalogQT.config.protocol,
            grid = button.up('grid'),
            source;


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

        cardioCatalogQT.service.UtilityService.submit_query(url, source, atom, payload);

    },

    submit_query: function(url, source, atom, payload){
        var json = [],
            obj,
            records = [],
            store = Ext.getStore('TestResults'),
            n,
            total,
            percentage;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('call to make url: ' + url);
        }

        // show loadMask during request
        Ext.getBody().mask("Computing...");

        // payload for POST
        obj = {
            query: {
                payload: atom
            }
        };

        Ext.Ajax.request({
            cors: true,
            timeout: 600000, //default is 30 seconds
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
                    console.log('json');
                    console.log(json);
                }

                // count returned from http response
                n = json.items;
                total = json.total;
                percentage = Ext.util.Format.number(n/total,'0,000.000');


                if (json !== null && typeof (json) !== 'undefined') {

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(records);
                        console.log('store');
                        console.log(store);
                        console.log('N');
                        console.log(json.items);
                        console.log(payload.atom);
                    }

                    source.add({
                        key: payload.key,
                        type: payload.type,
                        description: payload.description,
                        criteria: payload.criteria,
                        atom: payload.atom,
                        percent: percentage,
                        n: n
                    });
                    source.sync();

                    // update grid store content
                    Ext.StoreMgr.get('Payload').load();
                    Ext.ComponentQuery.query('#searchGrid')[0].getStore().load();

                    // stop loadMask
                    Ext.getBody().unmask();
                }
            }
        });
    },


    get_total: function(){
        var url_test = 'http://127.0.0.1:5000/total',
            n,
            total = Ext.create('cardioCatalogQT.store.PatientTotal'),
            json;

        Ext.Ajax.request({
            cors: true,
            useDefaultXhrHeader: false,
            url: url_test,
            headers: {
                'Accept': 'application/json'
            },
            disableCaching: false,

            success: function(response) {
                json = Ext.decode(response.responseText);

                // count returned from http response
                n = json.n;

                if (json !== null && typeof (json) !== 'undefined') {

                    total.add  = ({
                        n: n
                    });

                    total.sync();

                    Ext.StoreMgr.get('PatientTotal').load();
                    console.log(total)

                }
            }
        });
    }

});