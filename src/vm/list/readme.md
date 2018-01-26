Logic for presenting Mindset in form of plain ideas lists.  

---

Inspiration.

Basicaly UI/UX is inspired by Evernote UI: list of notes in sidebar, contents of note in main area.  
Similary `list` mode has list of parent ideas in the sidebar, and idea contents in main area.

Evernote notes is tree structure with 3 levels of nesting (`notebook stack` -> `notebook` -> `note`), and there are `tag`s for grouping notes across different notebooks.  

Mindset in turn is non-tree graph with cycles and no limit on nesting levels. It is harder to represent it in plain lists form.  
So we use parent-child relationships between ideas established by minimum spanning tree (MST) to present Mindset as a tree. Cross-references between ideas are presented as tags below idea title on the form.
