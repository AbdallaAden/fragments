const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('writeFragment', () => {
  test('writes and reads back a fragment', async () => {
    const fragment = { ownerId: 'a', id: 'b', data: 'test frag' };
    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });
});
describe('writeFragmentData and readFragmentData', () => {
  test('writes and reads back fragment data', async () => {
    const ownerId = 'a';
    const id = 'b';
    const buffer = Buffer.from('test frag');
    await writeFragmentData(ownerId, id, buffer);
    const result = await readFragmentData(ownerId, id);
    expect(result).toEqual(buffer);
  });
});

describe('listFragments', () => {
  test('lists fragment IDs for the given user', async () => {
    const ownerId = 'a';
    const fragment1 = { ownerId, id: 'b', data: 'test frag1' };
    const fragment2 = { ownerId, id: 'c', data: 'test frag2' };
    await writeFragment(fragment1);
    await writeFragment(fragment2);
    const result = await listFragments(ownerId);
    expect(result).toEqual([fragment1.id, fragment2.id]);
  });

  test('expands fragment objects when expand is true', async () => {
    const ownerId = 'a';
    const fragment1 = { ownerId, id: 'b', data: 'test frag1' };
    const fragment2 = { ownerId, id: 'c', data: 'test frag2' };
    await writeFragment(fragment1);
    await writeFragment(fragment2);
    const result = await listFragments(ownerId, true);
    expect(result).toEqual([fragment1, fragment2]);
  });

  test('returns empty array when there are no fragments', async () => {
    const ownerId = 'x';
    const result = await listFragments(ownerId);
    expect(result).toEqual([]);
  });
});

describe('deleteFragment', () => {
  test('deletes fragment metadata and data', async () => {
    const ownerId = 'a';
    const id = 'b';
    const buffer = Buffer.from('test frag');
    await writeFragment({ ownerId, id, data: 'test metadata' });
    await writeFragmentData(ownerId, id, buffer);
    await deleteFragment(ownerId, id);
    const metadataResult = await readFragment(ownerId, id);
    const dataResult = await readFragmentData(ownerId, id);
    expect(metadataResult).toBeUndefined();
    expect(dataResult).toBeUndefined();
  });
});
