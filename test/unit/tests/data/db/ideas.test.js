import { expect, createDB } from "test/utils";
import { spy } from "sinon";

import Idea from "src/model/entities/Idea";
import Point from "src/model/entities/Point";

import * as ideaDB from "src/data/db/ideas";

describe("ideas", () => {
  describe(".get()", () => {
    it("should return model", async () => {
      // setup
      const db = createDB();

      await db.put({
        _id: "123",
        value: "test",
        posRel: { x: 100, y: 200 }
      });

      // target
      const result = await ideaDB.get(db, "123");

      // check
      expect(result).to.be.instanceOf(Idea);
      expect(result.value).to.equal("test");
      expect(result.posRel).to.be.instanceOf(Point);
      expect(result.posRel).to.containSubset({ x: 100, y: 200 });
    });

    it("should fail if item does not exist", async () => {
      // setup
      const db = createDB();

      // target
      const promise = ideaDB.get(db, "123");

      // check
      await expect(promise).to.be.rejectedWith("missing");
    });
  });

  describe(".getAll()", () => {
    it("should return array of models", async () => {
      // setup
      const db = createDB();

      await db.put({
        _id: "123",
        mindsetId: "test id",
        value: "test value"
      });

      // target
      const result = await ideaDB.getAll(db, "test id");

      // check
      expect(result).to.have.length(1);
      expect(result[0]).to.be.instanceOf(Idea);
      expect(result[0].id).to.equal("123");
      expect(result[0].value).to.equal("test value");
    });

    it("should return ideas of certain mindset", async () => {
      // setup
      const db = createDB();

      await db.put({
        _id: "1",
        mindsetId: "test id"
      });

      await db.put({
        _id: "2",
        mindsetId: "another id"
      });

      // target
      const result = await ideaDB.getAll(db, "test id");

      // check
      expect(result).to.have.length(1);
      expect(result[0].id).to.equal("1");
    });
  });

  describe(".add()", () => {
    it("should add item to DB", async () => {
      // setup
      const db = createDB();

      const idea = new Idea({
        mindsetId: "mindset id",
        value: "test value",
        posRel: { x: 10, y: 20 }
      });

      // target
      await ideaDB.add(db, idea);

      // check
      const result = (await db.allDocs({ include_docs: true })).rows.map(
        r => r.doc
      );

      expect(result).to.have.length(1);
      expect(result[0]._id).to.equal(idea.id);
      expect(result[0].mindsetId).to.equal("mindset id");
      expect(result[0].value).to.equal("test value");
      expect(result[0].posRel.constructor).to.equal(Object);
      expect(result[0].posRel).to.deep.equal({ x: 10, y: 20 });
    });

    it("should add/get same item", async () => {
      // setup
      const db = createDB();

      const idea = new Idea({
        mindsetId: "mindset id",
        value: "test",
        posRel: { x: 10, y: 20 }
      });

      // target
      await ideaDB.add(db, idea);
      const result = await ideaDB.get(db, idea.id);

      // check
      expect(result).to.deep.equal(idea);
    });

    it("should fail on duplicates", async () => {
      // setup
      const db = createDB();
      db.put({ _id: "123" });

      const idea = new Idea({
        id: "123",
        mindsetId: "mindset id",
        posRel: { x: 10, y: 20 }
      });

      // target
      const promise = ideaDB.add(db, idea);

      await expect(promise).to.be.rejectedWith("Document update conflict");
    });

    it("should fail if parent mindset ID is empty", async () => {
      // setup
      const db = createDB();

      const idea = new Idea({
        id: "123",
        posRel: { x: 10, y: 20 }
      });

      // target
      const promise = ideaDB.add(db, idea);

      await expect(promise).to.be.rejectedWith(
        `Failed to add idea '123' with empty parent mindset ID`
      );
    });
  });

  describe(".update()", () => {
    it("should update item", async () => {
      // setup
      const db = createDB();

      db.post({
        _id: "123",
        value: "test 1",
        posRel: { x: 0, y: 0 }
      });

      const update = {
        id: "123",
        value: "test 2",
        posRel: { x: 0, y: 10 }
      };

      // target
      await ideaDB.update(db, update);

      // check
      const result = await db.get("123");

      expect(result.value).to.equal("test 2");
      expect(result.posRel).to.deep.equal({ x: 0, y: 10 });
    });

    it("should not store unknown props", async () => {
      // setup
      const db = createDB();

      db.post({ _id: "i" });

      const idea = {
        id: "i",
        pos: { x: 0, y: 0 },
        X: "unknown"
      };

      // target
      await ideaDB.update(db, idea);

      // check
      const result = await db.get("i");
      expect(result.X).to.not.exist;
    });

    it("should NOT call db if update object is empty", async () => {
      // setup
      const db = createDB();

      const get = spy(db.get);
      const put = spy(db.put);

      db.post({ _id: "i" });

      const idea = {
        id: "i"
      };

      // target
      await ideaDB.update(db, idea);

      // check
      expect(get.called).to.be.false;
      expect(put.called).to.be.false;
    });

    it("should fail if item does not exist", async () => {
      // setup
      const db = createDB();
      const idea = new Idea({ value: "val" });

      // target
      const promise = ideaDB.update(db, idea);

      // check
      await expect(promise).to.be.rejectedWith("missing");
    });

    it("should fail if parent mindset ID is empty", async () => {
      // setup
      const db = createDB();

      db.post({
        _id: "i",
        mindsetId: "1"
      });

      const patch = {
        id: "i",
        value: "test value",
        mindsetId: null
      };

      // target
      const promise = ideaDB.update(db, patch);

      // check
      await expect(promise).to.be.rejectedWith(
        `Failed to update idea 'i' with empty parent mindset ID`
      );
    });
  });

  describe(".remove()", () => {
    it("should remove item", async () => {
      // setup
      const db = createDB();
      await db.put({ _id: "die" });
      await db.put({ _id: "live" });

      // target
      await ideaDB.remove(db, "die");

      // check
      const result = await db.allDocs({ include_docs: true });

      expect(result.rows).to.have.length(1);
      expect(result.rows[0].id).to.equal("live");
    });

    it("should fail if item does not exist", async () => {
      // setup
      const db = createDB();

      // target
      const promise = ideaDB.remove(db, "die");

      // check
      await expect(promise).to.be.rejectedWith("missing");
    });
  });

  describe(".removeAll()", () => {
    it("should remove all items", async () => {
      // setup
      const db = createDB();

      await db.post({ value: "1" });
      await db.post({ value: "2" });
      await db.post({ value: "3" });

      // target
      await ideaDB.removeAll(db);

      // check
      const result = await db.allDocs();

      expect(result.rows).to.be.empty;
    });
  });
});
