import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-slider-bar',
  templateUrl: './slider-bar.component.html',
  styleUrls: ['./slider-bar.component.scss'],
})

//no lifecycle hooks needed
export class SliderBarComponent {
  @ViewChild('sliderTrack') sliderTrack!: ElementRef;
  @ViewChild('sliderThumb') sliderThumb!: ElementRef;

  ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //keep it super simple
  dragging = false;
  currentTick = 1;
  readonly TICK_WIDTH = 50; // Define tick width constant
  readonly THUMB_OFFSET = 5;
  // Define THUMB_OFFSET/TICK_WIDTH constant,
  //I would likely approach this with more robustness in a real app. An interview challenge is not the place to do that, keep it super simple.

  constructor(private renderer: Renderer2) {}
  //ngOnit() -> no lifecycle hooks needed

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.dragging = true;
    this.renderer.listen('document', 'mousemove', this.onMouseMove.bind(this));
    this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.dragging) {
      return;
    }
    const trackRect = this.sliderTrack.nativeElement.getBoundingClientRect();
    const thumbWidth = this.sliderThumb.nativeElement.offsetWidth;
    const newThumbPosition = event.clientX - trackRect.left - thumbWidth / 2;
    const nearestTickIndex = Math.round(newThumbPosition / this.TICK_WIDTH);
    const clampedTickIndex = Math.max(
      0,
      Math.min(nearestTickIndex, this.ticks.length - 1)
    );
    this.sliderThumb.nativeElement.style.left =
      clampedTickIndex * this.TICK_WIDTH +
      thumbWidth / 2 +
      this.THUMB_OFFSET +
      'px';
    this.currentTick = clampedTickIndex + 1;
  }

  onMouseUp(): void {
    this.dragging = false;
  }

  onTickClick(tick: number): void {
    const thumbWidth = this.sliderThumb.nativeElement.offsetWidth;
    this.sliderThumb.nativeElement.style.left =
      (tick - 1) * this.TICK_WIDTH + thumbWidth / 2 + this.THUMB_OFFSET + 'px';
    this.currentTick = tick;
  }

  isActiveTick(tick: number): boolean {
    return tick === this.currentTick;
  }
}
