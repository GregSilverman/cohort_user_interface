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

    url: function(payload){
        // value set via {cardioCatalogQT.config} in Application.js

        var queries = Ext.create('cardioCatalogQT.store.Queries'),
            dx =[],
            systolic = [],
            lab = [],
            url =  cardioCatalogQT.config.protocol,
            seperator = ':',
            delimiter = ';',
            n = payload.getCount(),
            i = 0,
            parent,
            query_criteria = '',
            labs = Ext.getStore('Labs'),
            description;

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Service test:' + payload);
            console.log('n: ' + n);
        }

        url += cardioCatalogQT.config.host;
        url += cardioCatalogQT.config.apiGetQ;



        payload.each(function(rec) {

            parent = cardioCatalogQT.service.UtilityService.parent_hash(rec.data.type); // get parent value

            if (payload.findExact('type','dx') != -1) {

                dx.push(rec);

                if (cardioCatalogQT.config.mode === 'test') {
                    console.log('found payload: Dx!' + i);
                    console.log(payload.data.items[i].data);
                    console.log(rec.data.key);

                }

            }

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('i: ' + i);
                console.log('url : ' + url);
                console.log(rec);
            }

            if (payload.findExact('type','blood_pressure_systolic') != -1) {

                systolic.push(rec);
                if (cardioCatalogQT.config.mode === 'test') {
                    console.log(rec);
                    console.log('found payload: systolic!');
                    console.log(rec.data.key);
                    console.log(parent);

                }
            }

            if (payload.findExact('type','lab') != -1) {

                lab.push(rec);


                if (cardioCatalogQT.config.mode === 'test') {

                    console.log(rec);
                    console.log('found payload: lab!');
                    console.log(rec.data.key);
                    console.log(parent);

                }
            }

            // assemble URL
            //TEST payload:
            // lab:test_code;eq;13457-7;lab:result_value_num;ge;160;
            // vital:blood_pressure;eq;blood_pressure;vital:blood_pressure_systolic;ge;160

            url += rec.data.type +
                seperator  +
                parent +
                delimiter;

                if (payload.data.items[i].data.key === 'blood_pressure_systolic' ||
                    payload.data.items[i].data.type === 'lab'){
                    url += 'eq';
                }
                else {
                    url += rec.data.comparator
                }

            url += delimiter;

                if (payload.data.items[i].data.key === 'blood_pressure_systolic'){
                   url += 'blood_pressure'
                }
                else if (payload.data.items[i].data.type === 'lab') {
                   url += rec.data.key

                    // get description for labs from store
                    description = labs.findRecord('code',rec.data.key);

                    if (cardioCatalogQT.config.mode === 'test') {
                        console.log('description:');
                        console.log(description.data.description);
                    }
                }
                else {
                    url += rec.data.value
                }

            url +=  delimiter +
                rec.data.type +
                seperator;

                if (payload.data.items[i].data.key === 'blood_pressure_systolic'){
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

            // save for display
            query_criteria += rec.data.type.toUpperCase() + ' '
                            + rec.data.comparator + ' '
                            + rec.data.value + ' ';

            // cannot grab description from xtype = 'combo'
            if (rec.data.type === 'lab') {
                query_criteria += description.data.description.toUpperCase() + ' ';
            }
            else {
                query_criteria += rec.data.description.toUpperCase() + ' ';
            }

            query_criteria += '<br>';

            if (cardioCatalogQT.config.mode === 'test') {
                console.log('query: ' + query_criteria);
            }

       });

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
            map.add('sex', 'sex');
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
            '<tpl for=".">',
                '<div class="clinical_phi" style="padding: 0 0 10px 20px;">',
                    '<tpl if="data.lft == 1">',
                        '<p>PATIENT: {data.sid}</p>',
                        '<p>___________________</p>',
                    '</tpl>',
                    '<div class="data" style="padding: 0 0 10px 20px;">',
                        '<tpl if="data.source == \'clinical\'">',
                            '<li>{data.attribute.attribute_value} : {data.value} </li>',
                        '</tpl>',
                        '<tpl if="data.source == \'phi\'">',
                            '<li>{data.attribute_value} : {data.value} </li>',
                        '</tpl>',
                    '</div>',
                '</div>',

                '<div class="aggregate" style="padding: 0 0 10px 20px;">',
                    '<tpl if="data.source == \'aggregate\'">',
                        '<li> sid: {data.sid} </li>',
                    '</tpl>',
                '</div>',
            '</tpl>'
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
                            + tpl.apply(store)); //TODO: add criteria on which query was executed
        panel.unmask();

    },

    clear_all: function() {
        var Payload = Ext.getStore('Payload');

        Payload.getProxy().clear();
        Payload.sync();

        if (cardioCatalogQT.config.mode === 'test') {
            console.log('Cleared!');
        }
    }

});