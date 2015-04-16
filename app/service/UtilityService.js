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

    url: function(payload) {
        var queries = Ext.create('cardioCatalogQT.store.Queries'),
            url =  cardioCatalogQT.config.protocol,
            seperator = ':',
            delimiter = ';',
            n = payload.getCount(),
            i = 0,
            parent,
            query_criteria = '';

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Service test:' + payload);
            console.log('n: ' + n);
        }

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiGetQ;

        payload.each(function(rec) {

            parent = cardioCatalogQT.service.UtilityService.parent_hash(rec.data.type); // get parent value

            url += rec.data.type +
                seperator  +
                parent +
                delimiter;

            if (payload.data.items[i].data.key === 'blood_pressure_systolic' ||
                payload.data.items[i].data.key === 'blood_pressure_diastolic' ||
                payload.data.items[i].data.type === 'lab'){
                url += 'eq';
            }
            else {
                url += rec.data.comparator
            }

            url += delimiter;

            if (payload.data.items[i].data.key === 'blood_pressure_systolic' ||
                payload.data.items[i].data.key === 'blood_pressure_diastolic'){
                url += 'blood_pressure'
            }
            else if (payload.data.items[i].data.type === 'lab') {
                url += rec.data.key
            }
            else {
                url += rec.data.value
            }

            url +=  delimiter +
                rec.data.type +
                seperator;

            if (payload.data.items[i].data.key === 'blood_pressure_systolic' ||
                payload.data.items[i].data.key === 'blood_pressure_diastolic'){
                url += payload.data.items[i].data.key;
            }
            else if (payload.data.items[i].data.type === 'lab') {
                url += 'result_value_num';
            }
            else {
                url += parent;
            }

            url += delimiter +
                rec.data.comparator +
                delimiter +
                rec.data.value;

            i += 1;

            // separate all query units by delimiter, except for the last
            if (i < n){
                url += delimiter;
            }

        });

        query_criteria += cardioCatalogQT.service.UtilityService.criteria(payload);

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('query: ' + query_criteria);
        }

        queries.add({
            url: url,
            user: 'gms',
            criteria: query_criteria
        });

        queries.sync();

        if (cardioCatalogQT.config.mode === 'test') {
            // get the last inserted url
            console.log('last query model:');
            console.log(queries.last());
            console.log(queries.last().data.url);
        }

        return url;
    },

    criteria: function(payload){

        var dx =[],
            px = [],
            rx = [],
            systolic = [],
            diastolic = [],
            lab = [],
            sex = [],
            age = [],
            parent,
            criteria = '',
            labs = Ext.getStore('Labs'),
            description,
            comparator;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Service test:' + payload);
        }

        payload.each(function(rec) {

            if (payload.findExact('type','dx') != -1) {

                dx.push(rec);

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('found payload: Dx!');
                    console.log(rec.data.key);
                }

            }

            if (payload.findExact('type','rx') != -1) {

                dx.push(rec);

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('found payload: Rx!');
                    console.log(rec.data.key);
                }

            }

            if (payload.findExact('type','px') != -1) {

                dx.push(rec);

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('found payload: Px!');
                    console.log(rec.data.key);
                }

            }

            if (payload.findExact('type','blood_pressure_diastolic') != -1) {

                diastolic.push(rec);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(rec);
                    console.log('found payload: diastolic!');
                    console.log(rec.data.key);
                    console.log(parent);
                }
            }

            if (payload.findExact('type','blood_pressure_systolic') != -1) {

                systolic.push(rec);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(rec);
                    console.log('found payload: systolic!');
                    console.log(rec.data.key);
                }
            }

            if (payload.findExact('type','sex') != -1) {

                sex.push(rec);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(rec);
                    console.log('found payload: sex!');
                    console.log(rec.data.key);
                }
            }

            if (payload.findExact('type','age') != -1) {

                age.push(rec);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(rec);
                    console.log('found payload: age!');
                    console.log(rec.data.key);
                }
            }

            if (payload.findExact('type','lab') != -1) {

                lab.push(rec);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(rec);
                    console.log('found payload: lab!');
                    console.log(rec.data.key);
                }
            }

            // get symblo for display
            comparator = cardioCatalogQT.service.UtilityService.comparator_hash(rec.data.comparator);

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('query comparator ');
                console.log(comparator);
            }

            criteria += rec.data.type.toUpperCase() + ' '
                            + ' ' + comparator + ' ' + ' '
                            + rec.data.value + ' ';

            criteria += rec.data.description.toUpperCase() + ' ';

            criteria += '<br>';

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('query criteria: ' + criteria);
            }

        });

        return criteria;
    },

    // TODO: ensure payload exists, is clean and does not produce spurious results
    url_request: function(){
        var queries = Ext.getStore('Queries'),//,
            url = queries.last().data.url;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('submitted query:');
            console.log(queries.last().data.url);
        }

        return url;

    },

    // get parent element
    parent_hash: function(type) {

        var map = new Ext.util.HashMap();

        map.add('blood_pressure_systolic', 'blood_pressure');
        map.add('blood_pressure_diastolic', 'blood_pressure');
        map.add('sex', 'sex');
        map.add('age','age');
        map.add('dx', 'dx_code');
        map.add('lab', 'test_code');
        map.add('px', 'proc_code');
        map.add('rx', 'drug_code');

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('parent');
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
        map.add('le', '<=');
        map.add('gt','>');
        map.add('ge', '>=');
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
            n = store.getCount(),
            queries = Ext.getStore('Queries'),
            criteria = queries.last().data.criteria;

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

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('submitted criteria:');
            console.log(criteria);
        }

        panel.setHtml(n + ' patients met the given criteria:'
                            + '<br>'
                            + criteria
                            + '<br>'
                            + tpl.apply(store));
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
                        '<tpl if="data.type === \'lab\' || data.type === \'dx\' || data.type === \'px\' || data.type === \'rx\' ">',
                            '<td>{data.type} {data.comparatorSymbol} {data.description}</td>',
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

    // get and store token
    http_auth: function() {

        var url = cardioCatalogQT.config.protocol;

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiLogin;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log(url);
            console.log('url: ' + url);
        }

        Ext.Ajax.request({
            cors: true,
            type: 'GET',
            useDefaultXhrHeader: false,
            url: url,
            disableCaching: false,
            success: function (response) {

                var loginResponse = Ext.JSON.decode(response.responseText),
                    sessionToken;

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(loginResponse.token);
                }

                sessionStorage.sessionToken = loginResponse.token;

                if (response.status === 200) {
                    // The server will send a token that can be used throughout the app to confirm that the user is authenticated.
                    sessionToken = loginResponse.token;
                    // TODO: write to sessionStorage
                    sessionStorage.sessionToken =  sessionToken;

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log(sessionToken);
                    }
                } else {
                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('bad http response');
                        console.log(loginResponse.message);
                    }
                }
            },
            failure: function (response) {
                //me.sessionToken = null;
                //me.signInFailure('Login failed. Please try again later.');
            }
        });

    },

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

    }

});