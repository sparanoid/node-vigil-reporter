/*
 * node-vigil-reporter
 *
 * Copyright 2018, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var VigilReporter = require("../").VigilReporter;
var assert = require("assert");


describe("vigil-reporter", function() {
  describe("constructor", function() {
    it("should succeed creating an instance with valid options", function() {
      assert.doesNotThrow(
        function() {
          new VigilReporter({
            url        : "http://localhost:8080",
            token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
            probe_id   : "relay",
            node_id    : "socket-client",
            replica_id : "192.168.1.10",
            interval   : 30,
            console    : require("console")
          });
        },

        "VigilReporter should not throw on valid options"
      );
    });

    it("should fail creating an instance with missing URL", function() {
      assert.throws(
        function() {
          new VigilReporter({
            token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
            probe_id   : "relay",
            node_id    : "socket-client",
            replica_id : "192.168.1.10"
          });
        },

        "VigilReporter should throw on missing URL"
      );
    });

    it("should fail creating an instance with invalid URL", function() {
      assert.throws(
        function() {
          new VigilReporter({
            url        : 0,
            token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
            probe_id   : "relay",
            node_id    : "socket-client",
            replica_id : "192.168.1.10"
          });
        },

        "VigilReporter should throw on invalid URL"
      );
    });

    it("should fail creating an instance with missing token", function() {
      assert.throws(
        function() {
          new VigilReporter({
            token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
            probe_id   : "relay",
            node_id    : "socket-client",
            replica_id : "192.168.1.10"
          });
        },

        "VigilReporter should throw on missing token"
      );
    });

    it("should fail creating an instance with missing probe_id", function() {
      assert.throws(
        function() {
          new VigilReporter({
            url        : "http://localhost:8080",
            token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
            node_id    : "socket-client",
            replica_id : "192.168.1.10"
          });
        },

        "VigilReporter should throw on missing probe_id"
      );
    });

    it("should fail creating an instance with invalid node_id", function() {
      assert.throws(
        function() {
          new VigilReporter({
            url        : "http://localhost:8080",
            token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
            probe_id   : "relay",
            replica_id : "192.168.1.10"
          });
        },

        "VigilReporter should throw on invalid node_id"
      );
    });

    it("should fail creating an instance with invalid replica_id",
      function() {
        assert.throws(
          function() {
            new VigilReporter({
              url        : "http://localhost:8080",
              token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
              probe_id   : "relay",
              node_id    : "socket-client"
            });
          },

          "VigilReporter should throw on invalid replica_id"
        );
      }
    );
  });

  describe("reporter", function() {
    it("should report metrics after a few seconds", function(done) {
      this.timeout(20000);

      var vigilReporter = new VigilReporter({
        url        : "http://localhost:8080",
        token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
        probe_id   : "relay",
        node_id    : "socket-client",
        replica_id : "192.168.1.10",
        console    : require("console")
      });

      setTimeout(function() {
        assert.equal(
          vigilReporter.end(), true, "Reporter should be ended"
        );

        done();
      }, 15000);
    });

    it("should flush replica on teardown after a few seconds", function(done) {
      this.timeout(5000);

      var vigilReporter = new VigilReporter({
        url        : "http://localhost:8080",
        token      : "REPLACE_THIS_WITH_A_SECRET_KEY",
        probe_id   : "relay",
        node_id    : "socket-client",
        replica_id : "192.168.1.10",
        console    : require("console")
      });

      setTimeout(function() {
        vigilReporter.end({
          flush : true,

          done  : function(error) {
            assert.equal(
              (error || {}).message,
              "Flush failed",
              "Reporter replica should fail on flush"
            );

            done();
          }
        });
      }, 3000);
    });
  });
});
